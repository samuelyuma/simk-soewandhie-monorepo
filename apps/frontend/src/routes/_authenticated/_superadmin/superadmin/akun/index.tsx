import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useState } from "react";

import { userListOptions } from "@/api/queries/user";
import DataTableServer from "@/components/data-table/data-table-server";
import PageHeader from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SuperadminBreadcrumb } from "@/constant/breadcrumb";
import { useDataTableServer } from "@/hooks/useDataTableServer";
import { useDialogAndModal } from "@/hooks/useDialogAndModal";
import type { User } from "@/types/user";

import ModalAddUser from "./-components/modal-add-user";
import ModalUpdateUser from "./-components/modal-update-user";

export const Route = createFileRoute(
  "/_authenticated/_superadmin/superadmin/akun/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { tableState, setTableState } = useDataTableServer();

  const { data, isPending } = useQuery(userListOptions());

  const { open } = useDialogAndModal();

  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const handleEditUser = (userData: User) => {
    setSelectedUser(userData);
    open("modal-update-user");
  };

  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: "nip",
      header: "NIP",
    },
    {
      accessorKey: "nama",
      header: "Nama Lengkap",
    },
    {
      accessorKey: "jabatan.nama",
      header: "Jabatan",
      cell: ({ row }) =>
        row.original.list_jabatan.map((jabatan) => (
          <Badge key={jabatan.id} className="m-1">
            {jabatan.jabatan.nama}
          </Badge>
        )) || "-",
    },
    {
      header: "Opsi",
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <Button
            variant={"blue"}
            size={"icon"}
            onClick={() => handleEditUser(row.original)}
          >
            <Edit size={16} />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Data Akun"
        breadcrumbItems={SuperadminBreadcrumb.akun}
      />

      <DataTableServer
        data={data?.data ?? []}
        columns={userColumns}
        isLoading={isPending}
        tableState={tableState}
        setTableState={setTableState}
        classNames={{ wrapper: "my-6" }}
        createItem={{
          dropdownLabel: "Tambah Akun",
          dialog: [
            {
              title: "Tambah Akun",
              name: "modal-add-user",
              component: <ModalAddUser />,
            },
          ],
        }}
        topContentOptions={{
          withRowCountSelector: true,
          withSearchBar: true,
          withAddButton: true,
        }}
      />

      <ModalUpdateUser userData={selectedUser} />
    </div>
  );
}
