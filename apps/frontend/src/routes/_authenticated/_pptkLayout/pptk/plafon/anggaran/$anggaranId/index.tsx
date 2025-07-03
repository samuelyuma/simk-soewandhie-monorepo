import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

import { useDataTableServer } from "@/hooks/useDataTableServer";
import { formatPrice } from "@/lib/utils";

import DataTableServer from "@/components/data-table/data-table-server";
import PageHeader from "@/components/layout/PageHeader";

import type { SubKegiatan } from "@/types/anggaran";

import { subKegiatanListOptions } from "@/api/queries/anggaran";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { anggaranId } = Route.useParams();

  const { tableState, setTableState } = useDataTableServer();

  const { data, isPending } = useQuery(
    subKegiatanListOptions(anggaranId, {
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.pageIndex + 1,
      search: tableState.globalFilter || undefined,
      sort_by: tableState.sorting[0]?.id,
      sort_order: tableState.sorting[0]?.desc ? "desc" : "asc",
    }),
  );

  const subKegiatanColumns: ColumnDef<SubKegiatan>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "kode",
      header: "Kode Sub Kegiatan",
    },
    {
      accessorKey: "nama",
      header: "Nama Sub Kegiatan",
      cell: ({ row }) => (
        <Link
          to="/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId"
          params={{
            anggaranId: String(anggaranId),
            subKegiatanId: String(row.original.id),
          }}
          className="underline hover:text-blue-600"
        >
          {row.original.nama}
        </Link>
      ),
    },
    {
      accessorKey: "total_belanja_sub_kegiatan",
      header: "Realisasi Belanja",
      cell: ({ row }) =>
        row.original.total_belanja_sub_kegiatan !== 0
          ? formatPrice(row.original.total_belanja_sub_kegiatan)
          : "-",
    },
    {
      accessorKey: "total_nominal_sub_kegiatan",
      header: "Nominal Sub Kegiatan",
      cell: ({ row }) =>
        row.original.total_nominal_sub_kegiatan !== 0
          ? formatPrice(row.original.total_nominal_sub_kegiatan)
          : "-",
    },
  ];

  const realisasiAnggaran =
    data?.data.total_belanja_kegiatan && data?.data.total_nominal_kegiatan
      ? (
          (data.data.total_belanja_kegiatan /
            data.data.total_nominal_kegiatan) *
          100
        ).toFixed(2)
      : 0;

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Sub Kegiatan"
        breadcrumbItems={PPTKBreadcrumb.anggaran["sub-kegiatan"]}
      />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm">Kode Kegiatan</p>
            <p className="font-semibold">{data?.data.kode}</p>
          </div>
          <div>
            <p className="text-sm">Nama Kegiatan</p>
            <p className="font-semibold">{data?.data.nama}</p>
          </div>
        </div>
        <div className="flex items-end justify-end gap-8">
          <div className="text-end">
            <p className="text-sm">Jumlah Belanja</p>
            <p className="font-semibold">
              {data?.data.total_belanja_kegiatan
                ? formatPrice(data?.data.total_belanja_kegiatan)
                : "-"}{" "}
              {data?.data.total_belanja_kegiatan !== 0 ? (
                <span className="text-green-800">
                  {`(${realisasiAnggaran}%)`}
                </span>
              ) : null}
            </p>
          </div>
          <div className="text-end">
            <p className="text-sm">Nominal Anggaran</p>
            <p className="font-semibold">
              {data?.data.total_nominal_kegiatan
                ? formatPrice(data?.data.total_nominal_kegiatan)
                : "-"}
            </p>
          </div>
        </div>
      </div>
      <DataTableServer
        data={data?.data.list_sub_kegiatan ?? []}
        meta={data?.meta}
        columns={subKegiatanColumns}
        isLoading={isPending}
        tableState={tableState}
        setTableState={setTableState}
        classNames={{ wrapper: "my-6" }}
      />
    </div>
  );
}
