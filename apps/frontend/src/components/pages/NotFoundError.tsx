import { Home } from "lucide-react";

import { Button } from "../ui/button";

export default function NotFoundError() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6">
      <img alt="not found error" src="/imgs/404-error.png" className="h-56" />

      <p className="text-center font-bold text-4xl text-red-800">
        404 - Page Not Found
      </p>

      <p className="text-center">
        Halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.{" "}
        <br />
        Silakan periksa kembali URL yang Anda masukkan atau kembali ke halaman
        utama.
      </p>

      <Button variant={"blue"}>
        <Home size={16} />
        <p className="font-medium text-sm">Kembali ke Beranda</p>
      </Button>
    </div>
  );
}
