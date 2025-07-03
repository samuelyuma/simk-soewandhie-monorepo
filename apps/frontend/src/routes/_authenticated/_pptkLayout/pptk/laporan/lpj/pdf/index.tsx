import {
  Document,
  Image,
  Page,
  PDFViewer,
  Text,
  View,
} from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { format, formatDate } from "date-fns";
import { id } from "date-fns/locale";
import { createTw } from "react-pdf-tailwind";

import { formatPrice, formatRomanMonth } from "@/lib/utils";

import PageHeader from "@/components/layout/PageHeader";
import PDFTable from "@/components/pdf-table/pdf-table";
import { Button } from "@/components/ui/button";

import type { ApiResponse } from "@/types/api";
import type { LpjPdfResponse } from "@/types/lpj";
import type { User } from "@/types/user";

import { userListOptions } from "@/api/queries/user";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouterState();
  const state: { lpjData?: ApiResponse<LpjPdfResponse> } =
    router.location.state;
  const lpjData = state?.lpjData;

  const { data: bendaharaData, isPending: isBendaharaLoading } = useQuery(
    userListOptions({ filter_by: "jabatan_id", filter_value: "7" }),
  );

  if (!lpjData) {
    return (
      <div className="pb-4">
        <PageHeader
          pageTitle="Unduh PDF LPJ"
          breadcrumbItems={PPTKBreadcrumb.laporan["lpj-pdf"]}
        />
        <div className="grid min-h-svh w-full place-items-center text-center">
          <div>
            <p className="text-lg font-semibold">Data LPJ tidak tersedia.</p>
            <p className="text-muted-foreground">
              Silakan kembali ke halaman laporan untuk membuat LPJ terlebih
              dahulu.
            </p>
            <Button asChild className="mt-4">
              <Link to="/pptk/laporan/lpj">Kembali ke Laporan LPJ</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isBendaharaLoading) {
    // Menampilkan loading jika data bendahara belum siap
    return (
      <div className="grid min-h-svh w-full place-items-center">
        <p>Loading Data...</p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader
        pageTitle="Unduh PDF LPJ"
        breadcrumbItems={PPTKBreadcrumb.laporan["lpj-pdf"]}
      />

      <div className="grid min-h-svh w-full place-items-center">
        {/* Tidak perlu lagi state isPending, langsung render PDFViewer */}
        <PDFViewer className="min-h-svh w-full">
          <PDFDocument
            data={lpjData.data}
            bendaharaData={bendaharaData?.data || []}
          />
        </PDFViewer>
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
    <Document
      title={`LPJ No. ${data?.id} - ${format(new Date(), "dd MMMM yyyy", {
        locale: id,
      })}`}
    >
      <Page size="A4" style={tw("px-8 pt-9 pb-12")}>
        <View style={tw("flex flex-row")}>
          <Image style={tw("mb-5 w-36")} src="/imgs/logo-pemkot-sby.png" />
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
              No: {data.id}/1 02 0200/LPJ-UP/{formatRomanMonth(data.created_at)}
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
              : {formatPrice(uang_persediaan_awal)}
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : {formatPrice(uang_persediaan_penggunaan)}
            </Text>
            <Text style={tw("font-medium text-base tracking-wide")}>
              : {formatPrice(uang_persediaan_akhir)}
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

        <View style={tw("mt-8")}>
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
                width: "w-[16.7%]",
              },
              {
                title: String(
                  data.list_rekening.reduce(
                    (total, rekening) => total + rekening.total_belanja,
                    0,
                  ),
                ),
                format: "currency",
                width: "w-[16.7%]",
              },
              {
                title: String(
                  data.list_rekening.reduce(
                    (total, rekening) =>
                      total + rekening.total_akumulasi_belanja,
                    0,
                  ),
                ),
                format: "currency",
                width: "w-[16.7%]",
              },
              {
                title: String(
                  data.list_rekening.reduce(
                    (total, rekening) =>
                      total + rekening.total_akumulasi_belanja,
                    0,
                  ),
                ),
                format: "currency",
                width: "w-[16.5%]",
              },
            ]}
          />
        </View>

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
