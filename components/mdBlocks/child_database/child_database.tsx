import { DatabaseBlock } from "@/types/databaseBlock";
import { MdBlock } from "@/types/MdBlock";

type Props = {
  mdBlock: MdBlock;
};

const parseParent = (parent: string): DatabaseBlock => {
  if (typeof parent === "string") return JSON.parse(parent);
  else return parent;
};

export default function Child_database({ mdBlock }: Props) {
  const { parent, blockId } = mdBlock;
  if (parent === "_") return;
  const block = parseParent(parent);
  const title =
    block.database_data.title.map((t) => t.plain_text).join("") || "Untitled";

  return (
    <div className="bg-white" id={blockId}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {/* ✅ 横スクロール対応ラッパー */}
      <div className="overflow-x-auto whitespace-nowrap">
        <table className="min-w-max border-collapse">
          <thead>
            <tr>
              {block.database_data.properties
                .slice() // reverseで直接破壊しないようにコピー
                .reverse()
                .map((prop) => (
                  <th
                    key={prop}
                    className="text-left text-sm font-medium text-gray-700 px-3 py-2 border-b"
                  >
                    {prop}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {block.query_data
              .slice()
              .reverse()
              .map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 border-t border-b">
                  {block.database_data.properties.map((prop, i) => {
                    const propData = (row.properties)[prop];
                    if (!propData)
                      return <td key={prop} className="px-3 py-2" />;
                    const isLast =
                      block.database_data.properties.length - 1 === i;

                    switch (propData.type) {
                      case "title":
                        return (
                          <td
                            key={prop}
                            className={`px-3 py-2 text-sm ${isLast ? "" : "border-r"}`}
                          >
                            {propData.title
                              .map((t) => t.plain_text)
                              .join("")}
                          </td>
                        );
                      case "rich_text":
                        return (
                          <td
                            key={prop}
                            className={`px-3 py-2 text-sm ${isLast ? "" : "border-r"}`}
                          >
                            {propData.rich_text
                              .map((t) => t.plain_text)
                              .join("")}
                          </td>
                        );
                      case "date":
                        const [year, month, day] =
                          propData.date.start.split("-");
                        return (
                          <td
                            key={prop}
                            className={`px-3 py-2 text-sm ${isLast ? "" : "border-r"}`}
                          >
                            {year}年{month}月{day}日
                            {propData.date.end
                              ? ` → ${propData.date.end}`
                              : ""}
                          </td>
                        );
                      case "select":
                        return (
                          <td
                            key={prop}
                            className={`px-3 py-2 text-sm ${isLast ? "" : "border-r"}`}
                          >
                            <span className="px-2 py-1 rounded-full text-xs font-medium">
                              {propData.select.name}
                            </span>
                          </td>
                        );
                      case "people":
                        return (
                          <td
                            key={prop}
                            className={`px-3 py-2 ${isLast ? "" : "border-r"}`}
                          >
                            <div className="flex items-center space-x-2">
                              {propData.people.map((p) => (
                                <div
                                  key={p.id}
                                  className="flex items-center space-x-1"
                                >
                                  <img
                                    src={p.avatar_url}
                                    alt={p.name}
                                    className="w-5 h-5 rounded-full"
                                  />
                                  <span className="text-sm">{p.name}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        );
                      default:
                        return (
                          <td key={prop} className="px-3 py-2 text-gray-500">
                            -
                          </td>
                        );
                    }
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
