// Read-only code viewer: file path header + line-numbered monospace body.
// No syntax-highlight dependency — kept intentionally minimal.
import { FileCode } from "./icons";

export default function CodeView({
  path,
  contents,
}: {
  path: string | null;
  contents: string | null;
}) {
  if (!path || contents == null) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-2">
        Select a file to view its contents
      </div>
    );
  }

  const lines = contents.replace(/\n$/, "").split("\n");

  return (
    <div className="flex h-full flex-col">
      {/* file path header */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3.5 py-2 text-xs">
        <FileCode width={14} height={14} className="text-muted-2" />
        <span className="font-medium text-foreground">{path}</span>
        <span className="ml-auto rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-2">
          read-only
        </span>
      </div>

      {/* code body */}
      <div className="scroll-thin flex-1 overflow-auto bg-surface">
        <table className="w-full border-collapse font-mono text-[12.5px] leading-relaxed">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="align-top">
                <td className="select-none whitespace-nowrap px-3 text-right text-muted-2">
                  {i + 1}
                </td>
                <td className="w-full whitespace-pre px-3 text-foreground">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
