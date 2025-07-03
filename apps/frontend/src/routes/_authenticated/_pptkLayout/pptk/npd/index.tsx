import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

import { useDataTableServer } from "@/hooks/useDataTableServer";
import { formatRomanMonth } from "@/lib/utils";

import DataTableServer from "@/components/data-table/data-table-server";
import PageHeader from "@/components/layout/PageHeader";

import type { RincianNpd } from "@/types/npd";

import { rincianNpdListOptions } from "@/api/queries/npd";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";

import ModalAddNpd from "./-components/modal-add-npd";

export const Route = createFileRoute("/_authenticated/_pptkLayout/pptk/npd/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tableState, setTableState } = useDataTableServer();

  const { data, isPending } = useQuery(
    rincianNpdListOptions({
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.pageIndex + 1,
      search: tableState.globalFilter || undefined,
      sort_by: tableState.sorting[0]?.id,
      sort_order: tableState.sorting[0]?.desc ? "desc" : "asc",
    }),
  );

  const rincianNpdColumns: ColumnDef<RincianNpd>[] = [
    {
      accessorKey: "id",
      header: "No",
    },
    {
      accessorKey: "no",
      header: "No. NPD",
      cell: ({ row }) =>
        `${row.original.no}/BLUD/NPD/UP/${formatRomanMonth(row.original.created_at || "")}/2025`,
    },
    {
      accessorKey: "is_panjar",
      header: "Jenis",
      cell: ({ row }) => (row.original.is_panjar ? "Panjar" : "Bukan Panjar"),
    },
    {
      accessorKey: "keperluan",
      header: "Keperluan",
      cell: ({ row }) => (
        <Link
          to="/pptk/npd/$npdId"
          params={{
            npdId: String(row.original.id),
          }}
          className="underline hover:text-blue-600"
        >
          {row.original.keperluan}
        </Link>
      ),
    },
    {
      accessorKey: "pptk.nama",
      header: "PPTK",
    },
    {
      accessorKey: "total_anggaran",
      header: "Anggaran",
    },
    {
      accessorKey: "total_pencairan",
      header: "Saat Ini",
    },
  ];

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Nota Pencairan Dana"
        breadcrumbItems={PPTKBreadcrumb.npd.list}
      />
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <p className="text-sm">Program</p>
          <p className="font-semibold">{data?.data.program}</p>
        </div>
        <div>
          <p className="text-sm">Kegiatan</p>
          <p className="font-semibold">{`${data?.data.kegiatan.kode} / ${data?.data.kegiatan.nama}`}</p>
        </div>
      </div>
      <DataTableServer
        data={data?.data.list_rincian_npd ?? []}
        meta={data?.meta}
        columns={rincianNpdColumns}
        isLoading={isPending}
        tableState={tableState}
        setTableState={setTableState}
        classNames={{ wrapper: "my-6" }}
        createItem={{
          dropdownLabel: "Tambah NPD",
          dialog: [
            {
              title: "Tambah NPD",
              name: "modal-add-npd",
              component: (
                <ModalAddNpd lastRincianObjekIndex={data?.meta.total_records} />
              ),
            },
          ],
        }}
        topContentOptions={{
          withRowCountSelector: true,
          withSearchBar: true,
          withAddButton: true,
        }}
      />
    </div>
  );
}
