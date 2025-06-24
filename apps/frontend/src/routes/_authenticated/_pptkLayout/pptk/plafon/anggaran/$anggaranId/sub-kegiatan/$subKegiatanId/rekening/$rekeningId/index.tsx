import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

import { rincianObjekListOptions } from "@/api/queries/anggaran";
import DataTableServer from "@/components/data-table/data-table-server";
import PageHeader from "@/components/layout/PageHeader";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";
import { AnggaranDialog } from "@/constant/dialog";
import { useDataTableServer } from "@/hooks/useDataTableServer";
import { usePriceFormat } from "@/hooks/usePriceFormat";
import type { RincianObjek } from "@/types/anggaran";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { anggaranId, subKegiatanId, rekeningId } = Route.useParams();

  const { tableState, setTableState } = useDataTableServer();

  const { data, isPending } = useQuery(
    rincianObjekListOptions(rekeningId, {
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.pageIndex + 1,
      search: tableState.globalFilter || undefined,
      sort_by: tableState.sorting[0]?.id,
      sort_order: tableState.sorting[0]?.desc ? "desc" : "asc",
    }),
  );

  const rincianObjekColumns: ColumnDef<RincianObjek>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nama",
      header: "Rincian Objek",
    },
    {
      accessorKey: "is_realized",
      header: "Status",
      cell: ({ row }) =>
        row.original.is_realized ? "Terealisasi" : "Belum Terealisasi",
    },
    {
      accessorKey: "nominal",
      header: "Nominal Rincian Objek",
      cell: ({ row }) =>
        row.original.nominal_realisasi !== 0
          ? usePriceFormat(row.original.nominal_realisasi)
          : "-",
    },
    {
      header: "Opsi?",
    },
  ];

  const realisasiRekening =
    data?.data.total_belanja_rekening && data?.data.total_nominal_rekening
      ? (
          (data.data.total_belanja_rekening /
            data.data.total_nominal_rekening) *
          100
        ).toFixed(2)
      : 0;

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Rincian Objek"
        breadcrumbItems={PPTKBreadcrumb.anggaran.rincianObjek(
          anggaranId,
          subKegiatanId,
        )}
      />

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm">Kode Rekening</p>
            <p className="font-semibold">{data?.data.kode}</p>
          </div>

          <div>
            <p className="text-sm">Nama Rekening</p>
            <p className="font-semibold">{data?.data.nama}</p>
          </div>
        </div>

        <div className="flex items-end justify-end gap-8">
          <div className="text-end">
            <p className="text-sm">Jumlah Belanja</p>
            <p className="font-semibold">
              {data?.data.total_belanja_rekening
                ? usePriceFormat(data?.data.total_belanja_rekening)
                : "-"}
              {data?.data.total_belanja_rekening ? (
                <span className="text-green-800">
                  {`(${realisasiRekening}%)`}
                </span>
              ) : null}
            </p>
          </div>

          <div className="text-end">
            <p className="text-sm">Nominal Anggaran</p>
            <p className="font-semibold">
              {data?.data.total_nominal_rekening
                ? usePriceFormat(data?.data.total_nominal_rekening)
                : "-"}
            </p>
          </div>
        </div>
      </div>

      <DataTableServer
        data={data?.data.list_rincian_objek ?? []}
        meta={data?.meta}
        columns={rincianObjekColumns}
        isLoading={isPending}
        tableState={tableState}
        setTableState={setTableState}
        classNames={{ wrapper: "my-6" }}
        createItem={{
          dropdownLabel: "Tambah Rincian Objek",
          dialog: AnggaranDialog["rincian-objek"],
        }}
        topContentOptions={{
          withRowCountSelector: true,
          withSearchBar: true,
          withExportDataSelector: true,
          withAddButton: true,
        }}
      />
    </div>
  );
}
