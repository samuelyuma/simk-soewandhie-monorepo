import {
  Document,
  Image,
  Page,
  PDFViewer,
  Text,
  View,
} from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format, formatDate } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect, useState } from "react";
import { createTw } from "react-pdf-tailwind";

import { useCreateLpjMutation } from "@/api/mutation/lpj/create";
import { userListOptions } from "@/api/queries/user";
import PageHeader from "@/components/layout/PageHeader";
import PDFTable from "@/components/pdf-table/pdf-table";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";
import { useMonthRoman } from "@/hooks/useMonthRoman";
import { usePriceFormat } from "@/hooks/usePriceFormat";
import type { ApiResponse } from "@/types/api";
import type { LpjPdfRequest, LpjPdfResponse } from "@/types/lpj";
import type { User } from "@/types/user";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/",
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): LpjPdfRequest => {
    return {
      periode: String(search.periode),
      jenisLaporan: String(search.jenisLaporan),
      npd: Number(search.npd),
    };
  },
});

function RouteComponent() {
  const { periode, jenisLaporan, npd } = Route.useSearch();

  const [lpjData, setLpjData] = useState<ApiResponse<LpjPdfResponse> | null>(
    null,
  );

  const createLpjPdf = useCreateLpjMutation();

  const bendaharaData = useQuery(
    userListOptions({ filter_by: "jabatan_id", filter_value: "7" }),
  );

  useEffect(() => {
    const fetchLpjData = async () => {
      try {
        const payload: any = {};

        if (npd !== 0) {
          payload.rincian_npd_id = npd;
        } else {
          payload.is_panjar = jenisLaporan === "panjar";
        }

        if (periode) {
          payload.bulan = periode;
        }

        const response = await createLpjPdf.mutateAsync(payload);
        setLpjData(response.data as ApiResponse<LpjPdfResponse>);
      } catch (error) {
        console.error("Error fetching LPJ data:", error);
      }
    };

    fetchLpjData();
  }, [periode, jenisLaporan, npd, createLpjPdf.mutateAsync]);

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Unduh PDF LPJ"
        breadcrumbItems={PPTKBreadcrumb.laporan["lpj-pdf"]}
      />

      <div className="grid min-h-svh w-full place-items-center">
        {lpjData && (
          <PDFViewer className="min-h-svh w-full">
            <PDFDocument
              data={lpjData.data}
              bendaharaData={bendaharaData.data?.data || []}
            />
          </PDFViewer>
        )}
      </div>
    </div>
  );
}

const tw = createTw({});

const PDFDocument = ({
  data,
  bendaharaData,
}: {
  data: LpjPdfResponse;
  bendaharaData: User[];
}) => {
  const uang_persediaan_awal = data.list_rekening.reduce(
    (total, rekening) => total + rekening.total_anggaran,
    0,
  );
  const uang_persediaan_penggunaan = data.list_rekening.reduce(
    (total, rekening) => total + rekening.total_belanja,
    0,
  );
  const uang_persediaan_akhir =
    uang_persediaan_awal - uang_persediaan_penggunaan;

  return (
    <Document>
      <Page size="A4" style={tw("px-8 pt-9 pb-12")}>
        <View style={tw("flex flex-row")}>
          <Image
            style={tw("mb-5 w-20 flex-shrink-0")}
            src="/imgs/logo-pemkot-sby.png"
          />
          <View style={tw("flex w-full flex-col items-center")}>
            <Text style={tw("text-center font-bold text-base tracking-wide")}>
              PEMERINTAH KOTA SURABAYA
            </Text>
            <Text style={tw("text-center font-bold text-base tracking-wide")}>
              RSUD DR. MOHAMAD SOEWANDHIE
            </Text>
            <Text style={tw("text-center font-bold text-sm tracking-wide")}>
              Tahun Anggaran: {data.created_at.slice(0, 4)}
            </Text>

            <Text
              style={tw("mt-8 text-center font-bold text-base tracking-wide")}
            >
              LAPORAN PERTANGGUNGJAWABAN UANG PERSEDIAAN
            </Text>
            <Text style={tw("text-center font-bold text-sm tracking-wide")}>
              No: {data.id}/1 02 0200/LPJ-UP/{useMonthRoman(data.created_at)}
              /2025
            </Text>
            <Text style={tw("text-center font-bold text-sm tracking-wide")}>
              Periode: {formatDate(data.created_at, "MMMM", { locale: id })}
            </Text>
          </View>
        </View>
        <View style={tw("mt-10 flex flex-row gap-4")}>
          <View>
            <Text style={tw("font-medium text-base tracking-wide")}>
              Uang Persedian (UP) Awal Periode
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              Penggunaan Uang Persediaan (UP)
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              Uang Persediaan (UP) Akhir Periode
            </Text>
          </View>
          <View>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : {usePriceFormat(uang_persediaan_awal)}
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : {usePriceFormat(uang_persediaan_penggunaan)}
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : {usePriceFormat(uang_persediaan_akhir)}
            </Text>
          </View>
        </View>
        <View style={tw("mt-6 flex flex-row gap-4")}>
          <View>
            <Text style={tw("font-medium text-base tracking-wide")}>
              Urusan
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              Program
            </Text>
            <Text> </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              Kegiatan
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              Sub Kegiatan
            </Text>
          </View>
          <View>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : 1.02 - URUSAN PEMERINTAH BIDANG KESEHATAN
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : 1.02.01 - PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH
            </Text>
            <Text style={tw("font-medium text-base tracking-wide ml-3")}>
              KABUPATEN/KOTA
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : {data.list_rekening[0].sub_kegiatan.kegiatan.kode} -{" "}
              {data.list_rekening[0].sub_kegiatan.kegiatan.nama}
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : {data.list_rekening[0].sub_kegiatan.kode} -{" "}
              {data.list_rekening[0].sub_kegiatan.nama}
            </Text>
          </View>
        </View>

        <PDFTable
          header={[
            {
              title: "Kode Rekening",
              key: "kodeRekening",
            },
            {
              title: "Uraian",
              key: "uraian",
            },
            {
              title: "Jumlah Anggaran",
              format: "currency",
              key: "jumlahAnggaran",
            },
            {
              title: "Belanja Periode Ini",
              format: "currency",
              key: "belanjaPeriodeIni",
            },
            {
              title: "Akumulasi Belanja",
              format: "currency",
              key: "akumulasiBelanja",
            },
            {
              title: "Sisa Anggaran",
              format: "currency",
              key: "sisaAnggaran",
            },
          ]}
          data={data.list_rekening.map((rekening) => ({
            kodeRekening: rekening.kode,
            uraian: rekening.nama,
            jumlahAnggaran: rekening.total_anggaran,
            belanjaPeriodeIni: rekening.total_belanja,
            akumulasiBelanja: rekening.total_akumulasi_belanja,
            sisaAnggaran: rekening.total_anggaran - rekening.total_belanja,
          }))}
          footer={[
            {
              title: "Jumlah",
              colSpan: 2,
            },
            {
              title: String(
                data.list_rekening.reduce(
                  (total, rekening) => total + rekening.total_anggaran,
                  0,
                ),
              ),
              format: "currency",
            },
            {
              title: String(
                data.list_rekening.reduce(
                  (total, rekening) => total + rekening.total_belanja,
                  0,
                ),
              ),
              format: "currency",
            },
            {
              title: String(
                data.list_rekening.reduce(
                  (total, rekening) => total + rekening.total_akumulasi_belanja,
                  0,
                ),
              ),
              format: "currency",
            },
            {
              title: String(
                data.list_rekening.reduce(
                  (total, rekening) => total + rekening.total_akumulasi_belanja,
                  0,
                ),
              ),
              format: "currency",
            },
          ]}
        />

        <View style={tw("mt-8 flex flex-col items-end font-medium text-base")}>
          <View style={tw("flex flex-col items-center")}>
            <Text style={tw("text-center")}>
              {format(new Date(), "dd MMMM yyyy", {
                locale: id,
              })}
            </Text>
            <Text>Bendahara Pengeluaran Pembantu</Text>

            <View style={tw("h-28")} />

            <Text>{bendaharaData[0].nama}</Text>
            <Text>NIP. {bendaharaData[0].nip}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
