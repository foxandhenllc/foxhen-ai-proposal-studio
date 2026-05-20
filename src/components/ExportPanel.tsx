import { useMemo, useState } from "react";

type ExportKey = "markdown" | "promptPack" | "snapshot";

type ExportPanelProps = {
  markdown: string;
  promptPackJson: string;
  proposalJson: string;
};

const exportLabels: Record<ExportKey, { label: string; fileName: string }> = {
  markdown: { label: "Client proposal Markdown", fileName: "client-proposal.md" },
  promptPack: { label: "AI prompt pack JSON", fileName: "ai-prompt-pack.json" },
  snapshot: { label: "Full proposal snapshot JSON", fileName: "proposal-snapshot.json" },
};

export function ExportPanel({ markdown, promptPackJson, proposalJson }: ExportPanelProps) {
  const [selectedExport, setSelectedExport] = useState<ExportKey>("markdown");
  const [copyState, setCopyState] = useState("Copy export");
  const exports = useMemo(
    () => ({
      markdown,
      promptPack: promptPackJson,
      snapshot: proposalJson,
    }),
    [markdown, promptPackJson, proposalJson],
  );
  const selectedText = exports[selectedExport];

  function downloadSelected() {
    const blob = new Blob([selectedText], { type: selectedExport === "markdown" ? "text/markdown" : "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportLabels[selectedExport].fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function copySelected() {
    if (!navigator.clipboard) {
      setCopyState("Clipboard unavailable");
      return;
    }

    void navigator.clipboard.writeText(selectedText).then(() => {
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy export"), 1600);
    });
  }

  return (
    <section id="exports" className="panel export-panel">
      <div className="panel-header">
        <div>
          <p>Exports</p>
          <h3>Package client copy and AI prep prompts without live model calls.</h3>
        </div>
        <div className="export-actions">
          <button type="button" className="secondary-action" onClick={copySelected}>
            {copyState}
          </button>
          <button type="button" className="primary-action" onClick={downloadSelected}>
            Download
          </button>
        </div>
      </div>
      <div className="segmented-control" aria-label="Export format">
        {(Object.keys(exportLabels) as ExportKey[]).map((key) => (
          <button key={key} type="button" className={selectedExport === key ? "active" : undefined} onClick={() => setSelectedExport(key)}>
            {exportLabels[key].label}
          </button>
        ))}
      </div>
      <textarea aria-label={exportLabels[selectedExport].label} className="export-output" value={selectedText} readOnly />
    </section>
  );
}
