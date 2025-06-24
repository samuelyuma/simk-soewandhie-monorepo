import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Pencil, Trash2 } from "lucide-react";

import { useDeletePencairanMutation } from "@/api/mutation/pencairan/delete";
import { useDeleteNpdMutation } from "@/api/mutation/rincian-npd/delete";
import { rincianNpdDetailOptions } from "@/api/queries/npd";
import DataTableServer from "@/components/data-table/data-table-server";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";
import { useDataTableServer } from "@/hooks/useDataTableServer";
import { useDialogAndModal } from "@/hooks/useDialogAndModal";
import { useMonthRoman } from "@/hooks/useMonthRoman";
import { usePriceFormat } from "@/hooks/usePriceFormat";
import DeleteAlert from "@/routes/_authenticated/-components/DeleteAlert";
import type { ItemRincianNpd } from "@/types/npd";

import ModalUpdateNpd from "../-components/modal-update-npd";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/npd/$npdId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { npdId } = Route.useParams();

  const { open } = useDialogAndModal();

  const { tableState, setTableState } = useDataTableServer();

  const { data, isPending } = useQuery(
    rincianNpdDetailOptions(npdId, {
      limit: tableState.pagination.pageSize,
      page: tableState.pagination.pageIndex + 1,
      search: tableState.globalFilter || undefined,
      sort_by: tableState.sorting[0]?.id,
      sort_order: tableState.sorting[0]?.desc ? "desc" : "asc",
    }),
  );

  const deletePencairanMutation = useDeletePencairanMutation();

  const deleteRincianNpd = (id: number) => {
    deletePencairanMutation.mutate(id);
    window.location.reload();
  };

  const deleteNpdMutation = useDeleteNpdMutation();

  const deleteNpd = (id: number) => {
    deleteNpdMutation.mutate(id);
    window.location.href = "/pptk/npd";
  };

  const pageTitle = `Rincian NPD No. ${data?.data.no}/BLUD/NPD/UP/${data?.data.created_at ? useMonthRoman(data.data.created_at) : ""}/${data?.data.npd.tahun}`;

  const Columns: ColumnDef<ItemRincianNpd>[] = [
    {
      accessorKey: "id",
      header: "No",
    },
    {
      accessorKey: "rekening.kode",
      header: "Kode Rekening",
    },
    {
      accessorKey: "rincian_objek.nama",
      header: "Nama Komponen",
    },
    {
      accessorKey: "rincian_objek.nominal",
      header: "Anggaran",
      meta: {
        className: "justify-center",
      },
      cell: ({ row }) => (
        <div className="text-center">
          {usePriceFormat(row.original.rincian_objek.nominal_anggaran)}
        </div>
      ),
    },
    {
      header: "Pencairan",
      meta: {
        className: "justify-center",
      },
      columns: [
        {
          accessorKey: "pencairan_sebelumnya.nominal",
          header: "Sebelumnya",
          meta: {
            className: "justify-center",
          },
          cell: ({ row }) => (
            <div className="text-center">
              {row.original.nominal_pencairan_sebelumnya
                ? usePriceFormat(row.original.nominal_pencairan_sebelumnya)
                : "-"}
            </div>
          ),
        },
        {
          accessorKey: "pencairan_saat_ini.nominal",
          header: "Saat Ini",
          meta: {
            className: "justify-center",
          },
          cell: ({ row }) => (
            <div className="text-center">
              {usePriceFormat(row.original.pencairan_saat_ini.nominal)}
            </div>
          ),
        },
      ],
    },
    {
      header: "Opsi",
      meta: {
        className: "justify-center",
      },
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <DeleteAlert
            deleteFunction={() =>
              deleteRincianNpd(row.original.pencairan_saat_ini.id)
            }
            trigger={
              <Button size={"icon"} variant={"outline"}>
                <Trash2 size={16} className="text-red-600" />
              </Button>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between">
        <PageHeader
          pageTitle={pageTitle}
          breadcrumbItems={PPTKBreadcrumb.npd.rincian}
        />
        <DeleteAlert
          deleteFunction={() => deleteNpd(Number(npdId))}
          trigger={
            <Button variant={"destructive"}>
              <Trash2 size={16} />
              <span className="mt-0.5">Hapus NPD</span>
            </Button>
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm">PPTK</p>
          <p className="font-semibold">{data?.data.pptk.nama}</p>
        </div>
        <div>
          <p className="text-sm">Sub Kegiatan</p>
          <p className="font-semibold">
            {`${data?.data.npd.sub_kegiatan.kode} / ${data?.data.npd.sub_kegiatan.nama}`}
          </p>
        </div>
        <div>
          <p className="text-sm">Program</p>
          <p className="font-semibold">{data?.data.npd.program}</p>
        </div>
        <div>
          <p className="text-sm">No. DPA</p>
          <p className="font-semibold">{data?.data.npd.no_dpa}</p>
        </div>
        <div>
          <p className="text-sm">Kegiatan</p>
          <p className="font-semibold">
            {`${data?.data.npd.kegiatan.kode} / ${data?.data.npd.kegiatan.nama}`}
          </p>
        </div>
        <div>
          <p className="text-sm">Tahun</p>
          <p className="font-semibold">{data?.data.npd.tahun}</p>
        </div>
      </div>

      <DataTableServer
        data={data?.data.list_item_rincian_npd ?? []}
        meta={data?.meta}
        columns={Columns}
        isLoading={isPending}
        tableState={tableState}
        setTableState={setTableState}
        classNames={{ wrapper: "my-6" }}
        topContentOptions={{
          withRowCountSelector: true,
          withSearchBar: true,
          customElements: [
            {
              id: "edit-npd-trigger",
              element: () => {
                if (data?.data) {
                  return (
                    <div className="mt-4">
                      <Button
                        variant={"blue"}
                        className="self-end"
                        onClick={(e) => {
                          e.preventDefault();
                          open("modal-update-npd");
                        }}
                      >
                        <Pencil size={16} />
                        <p>Edit</p>
                      </Button>
                      <ModalUpdateNpd dataNpd={data.data} />
                    </div>
                  );
                }
                return null;
              },
            },
            {
              id: "redirect-to-pdf",
              element: () => {
                if (data?.data) {
                  return (
                    <div className="mt-4">
                      <Link to="/pptk/npd/$npdId/pdf" params={{ npdId }}>
                        <Button variant={"green"} className="self-end">
                          <Download size={16} />
                          <p>Unduh</p>
                        </Button>
                      </Link>
                    </div>
                  );
                }
                return null;
              },
            },
          ],
        }}
      />
    </div>
  );
}
