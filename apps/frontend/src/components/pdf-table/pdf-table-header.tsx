import { Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

import type { TableColumn } from "./pdf-table";

const tw = createTw({});

const PDFTableHeader = ({ header }: { header: TableColumn[] }) => {
  return (
    <View>
      <View style={tw("flex flex-row")}>
        {header.map((item, index) => (
          <View
            key={index}
            style={tw(
              `${item.width || "flex-1"} ${index < header.length - 1 ? "border-black border-r" : ""}`,
            )}
          >
            {item.items ? (
              <View>
                <View
                  style={tw(
                    "flex items-center justify-center border-black border-b p-1",
                  )}
                >
                  <Text
                    style={tw(
                      "self-center text-center font-bold text-xs leading-tight",
                    )}
                  >
                    {item.title}
                  </Text>
                </View>
                <View style={tw("flex flex-row")}>
                  {item.items.map((subItem, subIndex) => (
                    <View
                      key={subIndex}
                      style={tw(
                        `${subItem.width || "flex-1"}  ${subIndex < item.items?.length - 1 ? "border-black border-r" : ""} p-1 flex justify-center items-center`,
                      )}
                    >
                      <Text style={tw("text-center text-xs leading-tight")}>
                        {subItem.title}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={tw(`p-1 flex justify-center items-center flex-1`)}>
                <Text style={tw("text-center font-bold text-xs leading-tight")}>
                  {item.title}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default PDFTableHeader;
