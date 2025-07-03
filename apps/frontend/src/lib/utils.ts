import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function padTwoDigits(num: number) {
  return num.toString().padStart(2, "0");
}

function getCurrentDate() {
  const date = new Date();
  return `${padTwoDigits(date.getDate())}-${padTwoDigits(date.getMonth() + 1)}-${date.getFullYear()}_${padTwoDigits(date.getHours())}.${padTwoDigits(date.getMinutes())}.${padTwoDigits(date.getSeconds())}`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
}

function downloadFile({
  file,
  fileName,
}: {
  file: BlobPart[];
  fileName: string;
}) {
  const url = window.URL.createObjectURL(new Blob(file));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// biome-ignore lint/suspicious/noExplicitAny: _
function arrayObjectToTable<T extends Record<string, any>>(data: T[]): string {
  if (!Array.isArray(data) || data.length === 0) return "Tidak terdapat data";

  const columns = Object.keys(data[0]);
  let table = `${columns.join("\t")}\n`;

  data.forEach((item) => {
    const row = columns
      .map((col) => {
        const value = item[col];

        if (value === undefined || value === null) {
          return "";
        }

        if (Array.isArray(value)) {
          return value.join(", ");
        }

        return String(value);
      })
      .join("\t");

    table += `${row}\n`;
  });

  return table;
}

const formatRomanMonth = (dateString: string) => {
  const monthRomanMap = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
  };
  const month = new Date(dateString).getMonth() + 1;
  return monthRomanMap[month as keyof typeof monthRomanMap];
};

export {
  cn,
  downloadFile,
  formatPrice,
  formatRomanMonth,
  getCurrentDate,
  arrayObjectToTable,
};
