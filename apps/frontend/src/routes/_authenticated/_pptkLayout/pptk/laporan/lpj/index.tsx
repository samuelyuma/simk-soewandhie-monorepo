import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

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

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/laporan/lpj/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const jenisLaporan = useState<string | null>(null);

  const tipeLaporan = useState<string | null>(null);

  const periode = useState<string | null>(null);
  const npd = useState<string | null>(null);

  const { data } = useQuery(
    rincianNpdListOptions({
      limit: 1000,
    }),
  );

  const npdList = data?.data.list_rincian_npd.map((npd) => ({
    id: npd.id,
    keperluan: npd.keperluan,
  }));

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Laporan LPJ"
        breadcrumbItems={PPTKBreadcrumb.laporan["lpj-page"]}
      />

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div>
          <Label className="mb-2 font-medium">Tipe Laporan</Label>
          <Select onValueChange={(value) => tipeLaporan[1](value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Tipe Laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"periode"}>Sesuai Periode</SelectItem>
              <SelectItem value={"npd"}>Sesuai NPD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tipeLaporan[0] === "periode" && (
          <>
            <div>
              <Label className="mb-2 font-medium">Periode</Label>
              <Select onValueChange={(value) => periode[1](value)}>
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
              <Select onValueChange={(value) => jenisLaporan[1](value)}>
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

        {tipeLaporan[0] === "npd" && (
          <div>
            <Label className="mb-2 font-medium">NPD</Label>
            <Select onValueChange={(value) => npd[1](value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih NPD" />
              </SelectTrigger>
              <SelectContent>
                {npdList?.map((npd, index) => (
                  <SelectItem key={index} value={npd.id.toString()}>
                    {npd.keperluan}
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
          disabled={periode[0] === null && npd[0] === null}
        >
          <Link
            to="/pptk/laporan/lpj/pdf"
            search={
              periode[0]
                ? {
                    periode: periode[0],
                    jenisLaporan: jenisLaporan[0] || "",
                    npd: 0,
                  }
                : {
                    periode: "",
                    jenisLaporan: "",
                    npd: Number(npd[0]) || 0,
                  }
            }
            className="flex items-center"
          >
            <ExternalLink size={16} className="mr-2" />
            Cetak
          </Link>
        </Button>
      </div>
    </div>
  );
}
