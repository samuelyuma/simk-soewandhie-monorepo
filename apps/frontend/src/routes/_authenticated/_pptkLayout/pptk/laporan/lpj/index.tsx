import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { useCreateLpjMutation } from "@/api/mutation/lpj/create";
import { rincianNpdListOptions } from "@/api/queries/npd";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";
import { month } from "@/constant/month";
import { toast } from "@/hooks/useToast";
import type { ApiResponse } from "@/types/api";
import type { LpjPdfResponse } from "@/types/lpj";

declare module "@tanstack/react-router" {
  interface HistoryState {
    lpjData?: ApiResponse<LpjPdfResponse>;
  }
}

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/laporan/lpj/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const [jenisLaporan, setJenisLaporan] = useState<string | null>(null);
  const [tipeLaporan, setTipeLaporan] = useState<string | null>(null);
  const [periode, setPeriode] = useState<string | null>(null);
  const [npd, setNpd] = useState<string | null>(null);

  const { data: npdData } = useQuery(
    rincianNpdListOptions({
      limit: 1000,
    }),
  );

  const npdList = npdData?.data.list_rincian_npd.map((item) => ({
    id: item.id,
    keperluan: item.keperluan,
  }));

  const createLpjPdf = useCreateLpjMutation();

  const handleCetakLpj = async () => {
    try {
      const payload: any = {};

      if (tipeLaporan === "npd" && npd) {
        payload.rincian_npd_id = Number(npd);
      } else if (tipeLaporan === "periode" && periode && jenisLaporan) {
        payload.is_panjar = jenisLaporan === "panjar";
        payload.bulan = periode;
      } else {
        toast({
          title: "Harap lengkapi semua pilihan laporan",
          variant: "danger",
        });
        return;
      }

      const response = await createLpjPdf.mutateAsync(payload);
      const lpjData = response.data as ApiResponse<LpjPdfResponse>;

      if (lpjData.data.list_rekening && lpjData.data.list_rekening.length > 0) {
        navigate({
          to: "/pptk/laporan/lpj/pdf",
          state: {
            lpjData: lpjData,
          },
        });
      } else {
        toast({
          title: "Gagal membuat laporan",
          description: "Data Laporan Pertanggungjawaban tidak ditemukan.",
          variant: "danger",
        });
      }
    } catch (error) {
      console.error("Error creating LPJ PDF:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal memproses permintaan Anda.",
        variant: "danger",
      });
    }
  };

  const isButtonDisabled =
    (tipeLaporan === "periode" && (!periode || !jenisLaporan)) ||
    (tipeLaporan === "npd" && !npd) ||
    !tipeLaporan ||
    createLpjPdf.isPending;

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Laporan LPJ"
        breadcrumbItems={PPTKBreadcrumb.laporan["lpj-page"]}
      />

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div>
          <Label className="mb-2 font-medium">Tipe Laporan</Label>
          <Select onValueChange={(value) => setTipeLaporan(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Tipe Laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"periode"}>Sesuai Periode</SelectItem>
              <SelectItem value={"npd"}>Sesuai NPD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tipeLaporan === "periode" && (
          <>
            <div>
              <Label className="mb-2 font-medium">Periode</Label>
              <Select onValueChange={(value) => setPeriode(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  {month.map((m, index) => (
                    <SelectItem key={index} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 font-medium">Jenis Laporan</Label>
              <Select onValueChange={(value) => setJenisLaporan(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Jenis Laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"panjar"}>Panjar</SelectItem>
                  <SelectItem value={"non-panjar"}>Non-Panjar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {tipeLaporan === "npd" && (
          <div>
            <Label className="mb-2 font-medium">NPD</Label>
            <Select onValueChange={(value) => setNpd(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih NPD" />
              </SelectTrigger>
              <SelectContent>
                {npdList?.map((npdItem) => (
                  <SelectItem key={npdItem.id} value={npdItem.id.toString()}>
                    {npdItem.keperluan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant={"blue"}
          disabled={isButtonDisabled}
          onClick={handleCetakLpj}
        >
          <ExternalLink size={16} className="mr-2" />
          {createLpjPdf.isPending ? "Memproses..." : "Cetak"}
        </Button>
      </div>
    </div>
  );
}
