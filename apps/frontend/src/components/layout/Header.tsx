import { LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-2 shadow">
      <div className="flex items-center gap-4">
        <img
          src="/imgs/logo-pemkot-sby.png"
          alt="logo-pemkot-sby"
          className="h-12 w-auto"
        />
        <div>
          <p className="font-bold text-xl">E-Payment</p>
          <p className="text-lg">Surabaya</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && user !== null ? (
          <>
            <div className="flex flex-col justify-end text-right">
              <p className="font-bold text-lg">{user.nama || ""}</p>
              {user.list_jabatan ? (
                <p className="text-base">
                  {user.list_jabatan[0].jabatan.nama} -{" "}
                  {user.list_jabatan[0].jabatan.keterangan}
                </p>
              ) : (
                <p>-</p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/imgs/avatar.jpg" alt="avatar" />
                  <AvatarFallback>
                    {user.username?.charAt(0) ?? "-"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Pengaturan Akun</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut size={16} />
                  <p className="ml-2">Keluar</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <p>Data user tidak tersedia</p>
            <Avatar className="h-12 w-12">
              <AvatarImage src="/imgs/avatar.jpg" alt="avatar" />
              <AvatarFallback>-</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
