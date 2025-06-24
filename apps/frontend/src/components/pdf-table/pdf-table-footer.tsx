import { Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

import type { TableColumn } from "./pdf-table";
import { formatValue } from "./pdf-table-body";

const tw = createTw({});

const PDFTableFooter = ({ footer }: { footer: TableColumn[] }) => (
  <View style={tw("flex flex-row border-black border-t")}>
    {footer.map((item, index) => {
      // Calculate flex value based on colspan
      const flexStyle = item.colSpan
        ? `flex-[${item.colSpan}]`
        : item.width || "flex-1";

      return (
        <View
          key={index}
          style={tw(
            `${flexStyle} ${index < footer.length - 1 ? "border-black border-r" : ""} p-2 flex justify-center items-center`,
          )}
        >
          <Text style={tw("text-center font-medium text-xs")}>
            {formatValue(item.title, item.format)}
          </Text>
        </View>
      );
    })}
  </View>
);

export default PDFTableFooter;
