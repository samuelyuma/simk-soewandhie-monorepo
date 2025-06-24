import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

import { eventListOptions, rekeningListOptions } from "@/api/queries/anggaran";
import DataTableServer from "@/components/data-table/data-table-server";
import PageHeader from "@/components/layout/PageHeader";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";
import { AnggaranDialog } from "@/constant/dialog";
import { useDataTableServer } from "@/hooks/useDataTableServer";
import { usePriceFormat } from "@/hooks/usePriceFormat";
import type { Rekening } from "@/types/anggaran";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { anggaranId, subKegiatanId } = Route.useParams();

  const { tableState, setTableState } = useDataTableServer();

  const { data: eventData } = useQuery(eventListOptions());
  const events =
    eventData?.map((item) => ({ id: item.id, nama: item.nama })) ?? [];

  const { data, isPending } = useQuery(
    rekeningListOptions(subKegiatanId, {
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.pageIndex + 1,
      search: tableState.globalFilter || undefined,
      sort_by: tableState.sorting[0]?.id,
      sort_order: tableState.sorting[0]?.desc ? "desc" : "asc",
      filter_by: tableState.filter[0]?.field || undefined,
      filter_value: tableState.filter[0]?.value || undefined,
    }),
  );

  const rekeningColumns: ColumnDef<Rekening>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "event.nama",
      header: "Event",
    },
    {
      accessorKey: "kode",
      header: "Kode Rekening",
    },
    {
      accessorKey: "nama",
      header: "Nama Rekening",
      cell: ({ row }) => (
        <Link
          to="/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId"
          params={{
            anggaranId,
            subKegiatanId,
            rekeningId: String(row.original.id),
          }}
          className="underline hover:text-blue-600"
        >
          {row.original.nama}
        </Link>
      ),
    },
    {
      accessorKey: "total_belanja_rekening",
      header: "Realisasi Belanja",
      cell: ({ row }) =>
        row.original.total_belanja_rekening !== 0
          ? usePriceFormat(row.original.total_belanja_rekening)
          : "-",
    },
    {
      accessorKey: "total_nominal_rekening",
      header: "Nominal Rekening",
      cell: ({ row }) =>
        row.original.total_nominal_rekening !== 0
          ? usePriceFormat(row.original.total_nominal_rekening)
          : "-",
    },
  ];

  const realisasiSubKegiatan =
    data?.data.total_belanja_sub_kegiatan &&
    data?.data.total_nominal_sub_kegiatan
      ? (
          (data.data.total_belanja_sub_kegiatan /
            data.data.total_nominal_sub_kegiatan) *
          100
        ).toFixed(2)
      : 0;

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Rekening"
        breadcrumbItems={PPTKBreadcrumb.anggaran.rekening(anggaranId)}
      />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm">Kode Sub Kegiatan</p>
            <p className="font-semibold">{data?.data.kode}</p>
          </div>
          <div>
            <p className="text-sm">Nama Sub Kegiatan</p>
            <p className="font-semibold">{data?.data.nama}</p>
          </div>
        </div>
        <div className="flex items-end justify-end gap-8">
          <div className="text-end">
            <p className="text-sm">Jumlah Belanja</p>
            <p className="font-semibold">
              {data?.data.total_belanja_sub_kegiatan
                ? usePriceFormat(data?.data.total_belanja_sub_kegiatan)
                : "-"}{" "}
              {data?.data.total_belanja_sub_kegiatan !== 0 ? (
                <span className="text-green-800">
                  {`(${realisasiSubKegiatan}%)`}
                </span>
              ) : null}
            </p>
          </div>
          <div className="text-end">
            <p className="text-sm">Nominal Anggaran</p>
            <p className="font-semibold">
              {data?.data.total_nominal_sub_kegiatan
                ? usePriceFormat(data?.data.total_nominal_sub_kegiatan)
                : "-"}
            </p>
          </div>
        </div>
      </div>
      <DataTableServer
        data={data?.data.list_rekening ?? []}
        meta={data?.meta}
        columns={rekeningColumns}
        isLoading={isPending}
        tableState={tableState}
        setTableState={setTableState}
        filterItems={{ event: events }}
        classNames={{ wrapper: "my-6" }}
        createItem={{
          dropdownLabel: "Tambah Item",
          dialog: AnggaranDialog.rekening,
        }}
        topContentOptions={{
          withRowCountSelector: true,
          withSearchBar: true,
          withExportDataSelector: true,
          withAddButton: true,
          withEventFilter: true,
        }}
      />
    </div>
  );
}
