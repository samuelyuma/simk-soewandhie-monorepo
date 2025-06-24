import { Home } from "lucide-react";

import { Button } from "../ui/button";

export default function InternalServerError() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6">
      <img src="/imgs/500-error.png" className="h-56" />

      <p className="text-center font-bold text-4xl text-red-800">
        500 - Internal Server Error
      </p>

      <p className="px-96 text-center text-sm">
        Mohon maaf atas ketidaknyamanan ini. Saat ini terjadi kesalahan internal
        pada server kami, yang menyebabkan halaman atau layanan yang Anda coba
        akses tidak dapat ditampilkan untuk sementara waktu.
      </p>

      <Button variant={"blue"} className="mt-4">
        <Home size={16} />
        <p className="font-medium text-sm">Kembali ke Beranda</p>
      </Button>
    </div>
  );
}
