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
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { createTw } from "react-pdf-tailwind";

import { rincianNpdDetailOptions } from "@/api/queries/npd";
import PageHeader from "@/components/layout/PageHeader";
import PDFTable from "@/components/pdf-table/pdf-table";
import { PPTKBreadcrumb } from "@/constant/breadcrumb";
import { useMonthRoman } from "@/hooks/useMonthRoman";
import type { ItemRincianNpd } from "@/types/npd";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const npdId = Route.useParams().npdId;

  const { data, isPending } = useQuery(
    rincianNpdDetailOptions(npdId, {
      limit: 1000,
    }),
  );

  if (isPending) {
    return (
      <div className="grid min-h-svh w-full place-items-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        pageTitle="Unduh PDF"
        breadcrumbItems={PPTKBreadcrumb.npd.pdf(npdId)}
      />
      <div className="grid min-h-svh w-full place-items-center">
        <PDFViewer className="min-h-svh w-full">
          <PDFDocument data={data} />
        </PDFViewer>
      </div>
    </div>
  );
}

const tw = createTw({});

const PDFDocument = ({ data }: { data: any }) => {
  const jumlahAnggaran = data?.data.list_item_rincian_npd?.reduce(
    (total: number, item: ItemRincianNpd) =>
      total + (item.rincian_objek.nominal_anggaran || 0),
    0,
  );

  const jumlahPencairanSebelumnya = data?.data.list_item_rincian_npd?.reduce(
    (total: number, item: ItemRincianNpd) =>
      total + (item.nominal_pencairan_sebelumnya || 0),
    0,
  );

  const jumlahPencairanSaatIni = data?.data.list_item_rincian_npd?.reduce(
    (total: number, item: ItemRincianNpd) =>
      total + (item.pencairan_saat_ini.nominal || 0),
    0,
  );

  return (
    <Document
      title={`Rincian PDF No. ${data?.data.no} - ${format(
        new Date(),
        "dd MMMM yyyy",
        {
          locale: id,
        },
      )}`}
    >
      <Page size="A4" style={tw("px-8 pt-9 pb-12")}>
        <View style={tw("flex flex-row items-center gap-10")}>
          <View>
            <Image
              style={tw("w-20 grayscale")}
              src="/imgs/logo-pemkot-sby.png"
            />
          </View>
          <View>
            <Text style={tw("font-medium text-base")}>
              1 02 0 00 0 00 70 0000 - RSUD dr. Mohamad Soewandhie
            </Text>
            <Text style={tw("font-medium text-base")}>
              Nota Pencairan Dana (NPD)
            </Text>
            <Text style={tw("font-medium text-base")}>
              No : {data?.data.no}/BLUD/NPD/UP/
              {useMonthRoman(data?.data.created_at)}/{data?.data.npd.tahun}
            </Text>
            <Text style={tw("font-medium text-base")}>
              Tanggal :{" "}
              {format(new Date(), "dd MMMM yyyy", {
                locale: id,
              })}
            </Text>
          </View>
        </View>

        <View style={tw("mt-10 flex flex-row items-center gap-20")}>
          <View>
            <Text style={tw("font-medium text-base")}>Jenis NPD</Text>
            <Text style={tw("font-medium text-base")}>PPTK</Text>
            <Text style={tw("font-medium text-base")}>Program</Text>
            <Text style={tw("font-medium text-base")}>Kegiatan</Text>
            <Text style={tw("font-medium text-base")}>Sub Kegiatan</Text>
            <Text style={tw("font-medium text-base")}>No. DPA</Text>
            <Text style={tw("font-medium text-base")}>Tahun Anggaran</Text>
          </View>
          <View>
            <Text style={tw("font-medium text-base")}>
              : {data?.data.is_panjar ? "Panjar" : "Non-Panjar"}
            </Text>
            <Text style={tw("font-medium text-base")}>
              : {data?.data.pptk.nama}
            </Text>
            <Text style={tw("font-medium text-base")}>
              : {data?.data.npd.program}
            </Text>
            <Text style={tw("font-medium text-base")}>
              : {data?.data.npd.kegiatan.nama}
            </Text>
            <Text style={tw("font-medium text-base")}>
              : {data?.data.npd.sub_kegiatan.nama}
            </Text>
            <Text style={tw("font-medium text-base")}>
              : {data?.data.npd.no_dpa}
            </Text>
            <Text style={tw("font-medium text-base")}>
              : {data?.data.npd.tahun}
            </Text>
          </View>
        </View>

        <View style={tw("mt-8")}>
          <PDFTable
            data={
              data?.data.list_item_rincian_npd?.map(
                (item: ItemRincianNpd, index: number) => ({
                  no: index + 1,
                  kodeRekening: item.rekening?.kode || "-",
                  namaKomponen: item.rincian_objek.nama || "-",
                  anggaran: item.rincian_objek.nominal_anggaran || 0,
                  pencairanSebelumnya: item.nominal_pencairan_sebelumnya || 0,
                  pencairanSaatIni: item.pencairan_saat_ini.nominal || 0,
                }),
              ) || []
            }
            header={[
              {
                title: "No.",
                key: "no",
                width: "w-8",
              },
              {
                title: "Kode Rekening",
                key: "kodeRekening",
                width: "w-[17.5%]",
              },
              {
                title: "Nama Komponen",
                key: "namaKomponen",
              },
              {
                title: "Anggaran",
                key: "anggaran",
                format: "currency",
                width: "w-[15%]",
              },
              {
                title: "Pencairan",
                width: "w-[25%]",
                items: [
                  {
                    title: "Sebelumnya",
                    key: "pencairanSebelumnya",
                    format: "currency",
                  },
                  {
                    title: "Saat Ini",
                    key: "pencairanSaatIni",
                    format: "currency",
                  },
                ],
              },
            ]}
            footer={[
              {
                title: "Jumlah",
                colSpan: 3,
              },
              {
                title: jumlahAnggaran,
                format: "currency",
                width: "w-[15%]",
              },
              {
                title: jumlahPencairanSebelumnya,
                format: "currency",
                width: "w-[12.6%]",
              },
              {
                title: jumlahPencairanSaatIni,
                format: "currency",
                width: "w-[12.4%]",
              },
            ]}
          />
        </View>

        <View style={tw("mt-8 flex flex-col")}>
          <Text style={tw("col-span-2 text-center font-medium text-base")}>
            Mengetahui,
          </Text>
          <View style={tw("mt-4 flex flex-row justify-between")}>
            <View
              style={tw(
                "flex flex-col items-center justify-center text-center font-medium text-base",
              )}
            >
              <Text>Disetujui Oleh,</Text>
              <Text>Kuasa Pengguna Anggaran</Text>

              <View style={tw("h-28")} />

              <Text>{data?.data.npd.kpa.nama}</Text>
              <Text>Pembina Utama Muda / IV c</Text>
              <Text>{data?.data.npd.kpa.nip}</Text>
            </View>
            <View
              style={tw(
                "flex flex-col items-center justify-center text-center font-medium text-base",
              )}
            >
              <Text>Disiapkan Oleh,</Text>
              <Text>Pejabat Pelaksanaan Teknis Kegiatan</Text>

              <View style={tw("h-28")} />

              <Text>{data?.data.pptk.nama}</Text>
              <Text>Pembina Utama Muda / IV c</Text>
              <Text>{data?.data.pptk.nip}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
