import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties } from "react";
import { DeliverablesEditor } from "./components/DeliverablesEditor.js";
import { EditableList } from "./components/EditableList.js";
import { EstimatePanel } from "./components/EstimatePanel.js";
import { ExportPanel } from "./components/ExportPanel.js";
import { IntakeForm } from "./components/IntakeForm.js";
import { RiskFlagsEditor } from "./components/RiskFlagsEditor.js";
import { TimelineEditor } from "./components/TimelineEditor.js";
import { sampleProposal } from "./data/proposalFixture.js";
import { exportPromptPackJson, exportProposalSnapshotJson } from "./exporters/json.js";
import { exportClientProposalMarkdown } from "./exporters/markdown.js";
import {
  clearStoredProposalDraft,
  cloneProposalDraft,
  exportProposalProjectJson,
  getBrowserStorage,
  parseProposalProjectJson,
  readStoredProposalDraft,
  writeStoredProposalDraft,
} from "./lib/localProject.js";
import { buildProposalPackage } from "./lib/proposalEngine.js";
import type { ProposalDraft } from "./lib/proposalTypes.js";
import "./styles.css";

type ProposalProjectState = {
  draft: ProposalDraft;
  status: string;
};

function loadInitialProposalProject(): ProposalProjectState {
  const sampleDraft = cloneProposalDraft(sampleProposal);
  const storage = getBrowserStorage();

  if (!storage) {
    return {
      draft: sampleDraft,
      status: "Local storage is unavailable here. Download project JSON to keep a backup.",
    };
  }

  try {
    const storedDraft = readStoredProposalDraft(storage);
    if (storedDraft) {
      return {
        draft: storedDraft,
        status: "Loaded your saved browser project.",
      };
    }
  } catch {
    return {
      draft: sampleDraft,
      status: "Saved project JSON could not be read, so the sample proposal loaded.",
    };
  }

  return {
    draft: sampleDraft,
    status: "Ready. Edits autosave in this browser and project JSON is available for backup.",
  };
}

function downloadTextFile(fileName: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [projectState, setProjectState] = useState<ProposalProjectState>(loadInitialProposalProject);
  const { draft } = projectState;
  const proposal = useMemo(() => buildProposalPackage(draft), [draft]);
  const markdown = useMemo(() => exportClientProposalMarkdown(proposal), [proposal]);
  const promptPackJson = useMemo(() => exportPromptPackJson(proposal), [proposal]);
  const proposalJson = useMemo(() => exportProposalSnapshotJson(proposal), [proposal]);
  const appStyle = {
    "--accent": draft.brand.accent,
    "--accent-2": draft.brand.accent2,
    "--ink": draft.brand.ink,
    "--soft": draft.brand.soft,
    "--warm": draft.brand.warm,
  } as CSSProperties;

  useEffect(() => {
    const storage = getBrowserStorage();

    if (!storage) return;

    try {
      writeStoredProposalDraft(storage, draft);
    } catch {
      setProjectState((current) => ({
        ...current,
        status: "Could not save locally. Download project JSON to keep a backup.",
      }));
    }
  }, [draft]);

  function updateDraft(updater: (current: ProposalDraft) => ProposalDraft) {
    setProjectState((current) => ({
      ...current,
      draft: updater(current.draft),
      status: getBrowserStorage() ? "Saved locally in this browser." : "Local storage is unavailable here. Download project JSON to keep a backup.",
    }));
  }

  function replaceDraft(draft: ProposalDraft, status: string) {
    setProjectState({
      draft,
      status,
    });
  }

  function handleDownloadProject() {
    downloadTextFile("foxhen-proposal-project.json", exportProposalProjectJson(draft), "application/json");
    setProjectState((current) => ({
      ...current,
      status: "Downloaded a project JSON backup for this editable proposal.",
    }));
  }

  async function handleImportProject(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const importedDraft = parseProposalProjectJson(await file.text());
      replaceDraft(
        importedDraft,
        getBrowserStorage()
          ? `Imported ${file.name} and saved it to this browser.`
          : `Imported ${file.name}. Local storage is unavailable here, so download project JSON to keep a backup.`,
      );
    } catch (error) {
      setProjectState((current) => ({
        ...current,
        status: error instanceof Error ? error.message : "Project import failed.",
      }));
    }
  }

  function handleResetSample() {
    const storage = getBrowserStorage();
    if (storage) {
      clearStoredProposalDraft(storage);
    }
    replaceDraft(
      cloneProposalDraft(sampleProposal),
      storage
        ? "Reset to the sample proposal. Future edits will autosave locally."
        : "Reset to the sample proposal. Local storage is unavailable here, so download project JSON to keep a backup.",
    );
  }

  return (
    <div className="app-shell" style={appStyle}>
      <header className="site-header">
        <a className="brand" href={draft.brand.website}>
          <span className="brand-mark">F&amp;H</span>
          <span>
            <strong>{draft.brand.companyName}</strong>
            <small>Proposal Studio</small>
          </span>
        </a>
        <nav aria-label="Proposal builder sections">
          <a href="#project">Project</a>
          <a href="#intake">Intake</a>
          <a href="#deliverables">Deliverables</a>
          <a href="#estimate">Estimate</a>
          <a href="#exports">Exports</a>
          <a className="nav-button" href={draft.brand.repositoryUrl}>
            Repository
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="service-line">Static proposal/scoping assistant</p>
            <h1>Build a scoped AI proposal from intake to export.</h1>
            <p className="lede">
              A public-safe React + TypeScript + Vite demo for shaping assumptions, exclusions, deliverables, timeline,
              risks, estimate ranges, and reusable AI prompt packs without a backend or live model calls.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#intake">
                Start with intake
              </a>
              <a className="secondary-action" href="#exports">
                View exports
              </a>
            </div>
            <div className="credibility-strip" aria-label="Public demo safeguards">
              <span>Autosaves locally</span>
              <span>Reset to sample</span>
              <span>Project JSON backup</span>
              <span>No auth or secrets</span>
              <span>No live AI calls</span>
            </div>
          </div>

          <aside className="hero-console" aria-label="Current proposal summary">
            <span className="eyebrow">Current package</span>
            <h2>{proposal.projectTitle}</h2>
            <p>{proposal.intake.clientName}</p>
            <div className="console-grid">
              <article>
                <span>Complexity</span>
                <strong>{proposal.complexity.level}</strong>
                <small>{proposal.complexity.total} pts</small>
              </article>
              <article>
                <span>Range</span>
                <strong>{proposal.priceRange.label}</strong>
                <small>client-facing</small>
              </article>
              <article>
                <span>Systems</span>
                <strong>{proposal.intake.systems.length}</strong>
                <small>{proposal.intake.systems.join(" · ")}</small>
              </article>
            </div>
          </aside>
        </section>

        <section id="project" className="panel project-panel">
          <div className="panel-header">
            <div>
              <p>Browser project</p>
              <h3>Keep real scoping work durable without accounts, servers, or paid APIs.</h3>
              <small>Autosaves to localStorage on this device. Download JSON when you want a portable backup or handoff file.</small>
            </div>
            <div className="project-actions">
              <button type="button" className="secondary-action" onClick={handleResetSample}>
                Reset to sample
              </button>
              <label className="secondary-action file-action">
                Import project JSON
                <input type="file" accept="application/json,.json" onChange={handleImportProject} />
              </label>
              <button type="button" className="primary-action" onClick={handleDownloadProject}>
                Download project JSON
              </button>
            </div>
          </div>
          <p className="status-message" role="status">
            {projectState.status}
          </p>
        </section>

        <section className="workspace-grid">
          <IntakeForm intake={draft.intake} onChange={(intake) => updateDraft((current) => ({ ...current, intake }))} />
          <EstimatePanel proposal={proposal} onEstimateChange={(estimate) => updateDraft((current) => ({ ...current, estimate }))} />
        </section>

        <section className="builder-grid" aria-label="Proposal scope builder">
          <DeliverablesEditor deliverables={draft.deliverables} onChange={(deliverables) => updateDraft((current) => ({ ...current, deliverables }))} />
          <TimelineEditor timeline={draft.timeline} onChange={(timeline) => updateDraft((current) => ({ ...current, timeline }))} />
          <RiskFlagsEditor riskFlags={draft.riskFlags} onChange={(riskFlags) => updateDraft((current) => ({ ...current, riskFlags }))} />
          <EditableList
            addLabel="Add assumption"
            description="Public-safe facts the estimate depends on."
            eyebrow="Assumptions"
            items={draft.assumptions}
            placeholder="New proposal assumption."
            title="State what must be true."
            onChange={(assumptions) => updateDraft((current) => ({ ...current, assumptions }))}
          />
          <EditableList
            addLabel="Add exclusion"
            description="Boundaries that prevent scope creep or unsafe expectations."
            eyebrow="Exclusions"
            items={draft.exclusions}
            placeholder="New proposal exclusion."
            title="Clarify what v1 does not include."
            onChange={(exclusions) => updateDraft((current) => ({ ...current, exclusions }))}
          />
        </section>

        <ExportPanel markdown={markdown} promptPackJson={promptPackJson} proposalJson={proposalJson} />
      </main>
    </div>
  );
}

export default App;
