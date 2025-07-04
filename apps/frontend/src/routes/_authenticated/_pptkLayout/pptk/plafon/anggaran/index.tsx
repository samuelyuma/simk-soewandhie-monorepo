import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

import { kegiatanListOptions } from "@/api/queries/anggaran";
import DataTableServer from "@/components/data-table/data-table-server";
import PageHeader from "@/components/layout/PageHeader";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";
import { useDataTableServer } from "@/hooks/useDataTableServer";
import { formatPrice } from "@/lib/utils";
import type { Kegiatan } from "@/types/anggaran";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/plafon/anggaran/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { tableState, setTableState } = useDataTableServer();

  const { data, isPending } = useQuery(
    kegiatanListOptions({
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.pageIndex + 1,
      search: tableState.globalFilter || undefined,
      sort_by: tableState.sorting[0]?.id,
      sort_order: tableState.sorting[0]?.desc ? "desc" : "asc",
    }),
  );

  const kegiatanColumns: ColumnDef<Kegiatan>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "kode",
      header: "Kode Rekening",
    },
    {
      accessorKey: "nama",
      header: "Nama Kegiatan",
      cell: ({ row }) => (
        <Link
          from="/pptk/plafon/anggaran"
          to="/pptk/plafon/anggaran/$anggaranId"
          params={{ anggaranId: String(row.original.id) }}
          className="underline hover:text-blue-600"
        >
          {row.original.nama}
        </Link>
      ),
    },
    {
      accessorKey: "total_belanja_kegiatan",
      header: "Realisasi Belanja",
      cell: ({ row }) =>
        row.original.total_belanja_kegiatan !== 0
          ? formatPrice(row.original.total_belanja_kegiatan)
          : "-",
    },
    {
      accessorKey: "total_nominal_kegiatan",
      header: "Nominal Anggaran",
      cell: ({ row }) =>
        row.original.total_nominal_kegiatan !== 0
          ? formatPrice(row.original.total_nominal_kegiatan)
          : "-",
    },
  ];

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Data Anggaran BLUD"
        breadcrumbItems={PPTKBreadcrumb.anggaran.kegiatan}
      />
      <DataTableServer
        data={data?.data ?? []}
        meta={data?.meta}
        columns={kegiatanColumns}
        isLoading={isPending}
        tableState={tableState}
        setTableState={setTableState}
        classNames={{ wrapper: "my-6" }}
      />
    </div>
  );
}
