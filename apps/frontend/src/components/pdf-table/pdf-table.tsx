import { View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

import PDFTableBody from "./pdf-table-body";
import PDFTableFooter from "./pdf-table-footer";
import PDFTableHeader from "./pdf-table-header";

interface Column {
  title: string;
  key?: string;
  width?: string;
  format?: "currency" | "number" | "text";
}

type ColumnWithRequiredKey = Column & { key: string };

export interface TableColumn extends Column {
  colSpan?: number;
  items?: ColumnWithRequiredKey[];
}

type PDFTableProps<T> = {
  data: Record<string, T>[];
  header: TableColumn[];
  footer?: TableColumn[];
};

const tw = createTw({});

const PDFTable = <T,>({ data, header, footer }: PDFTableProps<T>) => (
  <View style={tw("border border-black")}>
    <PDFTableHeader header={header} />
    <PDFTableBody data={data} header={header} />
    <PDFTableFooter footer={footer || []} />
  </View>
);

export default PDFTable;
