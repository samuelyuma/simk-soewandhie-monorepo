import { Home } from "lucide-react";

import { Button } from "../ui/button";

export default function ForbiddenError() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6">
      <img src="/imgs/403-error.png" className="h-56" />

      <p className="text-center font-bold text-4xl text-red-800">
        403 - Forbidden
      </p>

      <p className="px-96 text-center text-sm">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Kemungkinan
        Anda mencoba mengakses halaman yang terbatas hanya untuk pengguna
        tertentu, atau sesi Anda telah berakhir.
      </p>

      <Button variant={"blue"} className="mt-4">
        <Home size={16} />
        <p className="font-medium text-sm">Kembali ke Beranda</p>
      </Button>
    </div>
  );
}
