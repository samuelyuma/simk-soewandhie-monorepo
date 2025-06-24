import { Download } from "lucide-react";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import { ExportData } from "@/constant/export-data";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";
import { arrayObjectToTable, downloadFile } from "@/lib/utils";

const ExportOptions = [
  "All",
  "Print",
  "CSV",
  "Excel",
  "PDF",
  "Copy to Clipboard",
] as const;
type TExportOptions = (typeof ExportOptions)[number];
export type TExportData = "anggaran" | "bank" | "npwp";

export default function DataTableExport({
  type,
  id,
}: {
  type: TExportData;
  id?: string;
}) {
  const [event, setEvent] = useState<TExportOptions>("All");
  const { toast } = useToast();

  function exportConfig() {
    if (type === "anggaran") {
      if (!id) {
        toast({
          variant: "danger",
          title: `ID ${type} tidak ditemukan`,
        });
        return null;
      }
      return ExportData.anggaran(id);
    }
    return ExportData[type];
  }

  function handleExport(option: TExportOptions) {
    const config = exportConfig();
    if (!config) return;

    switch (option) {
      case "CSV":
      case "Excel":
        handleDownloadFile(config, option);
        break;
      case "Copy to Clipboard":
        handleCopyToClipboard(config.url);
        break;
      // Add additional export types here
    }
  }

  function handleDownloadFile(
    config: { url: string; fileName: string },
    option: TExportOptions,
  ) {
    const format = option === "CSV" ? "csv" : option === "Excel" ? "excel" : "";
    const extension = option === "CSV" ? ".csv" : ".xlsx";

    api
      .get(`${config.url}/${format}`, { responseType: "arraybuffer" })
      .then((res) => {
        downloadFile({
          file: [res.data],
          fileName: `${config.fileName}${extension}`,
        });
      })
      .catch(() => {
        toast({
          variant: "danger",
          title: `Gagal mengunduh data ${type}`,
        });
      });
  }

  function handleCopyToClipboard(url: string) {
    api
      .get(`${url}/copy`)
      .then((res) => {
        const tableData = arrayObjectToTable(res.data.data);
        navigator.clipboard.writeText(tableData);
        toast({
          variant: "success",
          title: `Seluruh data ${type} berhasil disalin`,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "danger",
          title: `Gagal menyalin data ${type}`,
        });
      });
  }

  function handleValueChange(value: TExportOptions) {
    setEvent(value);
    handleExport(value);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Ekspor Data</Label>
      <Select value={event} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[120px]">
          <Download />
          Export
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Opsi Export</SelectLabel>
            <SelectSeparator />
            {ExportOptions.map((item, index) => (
              <SelectItem key={index} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
