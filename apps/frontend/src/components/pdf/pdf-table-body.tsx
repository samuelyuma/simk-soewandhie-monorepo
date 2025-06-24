import { Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

import type { TableColumn } from "./pdf-table";

const tw = createTw({});

export const formatValue = (
  value: any,
  format?: "currency" | "number" | "text",
): string => {
  if (value === null || value === undefined) return "-";

  switch (format) {
    case "currency":
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(Number(value) || 0);
    case "number":
      return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
    default:
      return String(value);
  }
};

const PDFTableBody = ({
  data,

  header,
}: {
  data: Record<string, any>[];
  header: TableColumn[];
}) => (
  <View>
    {data.map((row, rowIndex) => (
      <View key={rowIndex} style={tw(`flex flex-row border-t border-black`)}>
        {header.map((column, colIndex) => {
          const isLastColumn = colIndex === header.length - 1;
          const columnStyle = tw(
            `${column.width || "flex-1"} ${!isLastColumn ? "border-black border-r" : ""} flex justify-center`,
          );

          return (
            <View key={colIndex} style={columnStyle}>
              {column.items ? (
                <View style={tw("flex flex-1 flex-row")}>
                  {column.items.map((subItem, subIndex) => (
                    <View
                      key={subIndex}
                      style={tw(
                        `flex flex-1 justify-center items-center ${subIndex < column.items?.length - 1 ? "border-black border-r" : ""}`,
                      )}
                    >
                      <Text style={tw("whitespace-normal text-center text-xs")}>
                        {formatValue(row[subItem.key], subItem.format)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={tw("flex items-center justify-center p-2")}>
                  <Text style={tw("text-center text-xs")}>
                    {column.key
                      ? formatValue(row[column.key], column.format)
                      : "-"}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    ))}
  </View>
);

export default PDFTableBody;
