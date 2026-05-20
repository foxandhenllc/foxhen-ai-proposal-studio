import { useMemo, useState, type CSSProperties } from "react";
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
import { buildProposalPackage } from "./lib/proposalEngine.js";
import type { ProposalDraft } from "./lib/proposalTypes.js";
import "./styles.css";

function App() {
  const [draft, setDraft] = useState<ProposalDraft>(sampleProposal);
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
              <span>Fixture data only</span>
              <span>No auth or secrets</span>
              <span>No live AI calls</span>
              <span>Client-safe Markdown + JSON</span>
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

        <section className="workspace-grid">
          <IntakeForm intake={draft.intake} onChange={(intake) => setDraft((current) => ({ ...current, intake }))} />
          <EstimatePanel proposal={proposal} onEstimateChange={(estimate) => setDraft((current) => ({ ...current, estimate }))} />
        </section>

        <section className="builder-grid" aria-label="Proposal scope builder">
          <DeliverablesEditor deliverables={draft.deliverables} onChange={(deliverables) => setDraft((current) => ({ ...current, deliverables }))} />
          <TimelineEditor timeline={draft.timeline} onChange={(timeline) => setDraft((current) => ({ ...current, timeline }))} />
          <RiskFlagsEditor riskFlags={draft.riskFlags} onChange={(riskFlags) => setDraft((current) => ({ ...current, riskFlags }))} />
          <EditableList
            addLabel="Add assumption"
            description="Public-safe facts the estimate depends on."
            eyebrow="Assumptions"
            items={draft.assumptions}
            placeholder="New proposal assumption."
            title="State what must be true."
            onChange={(assumptions) => setDraft((current) => ({ ...current, assumptions }))}
          />
          <EditableList
            addLabel="Add exclusion"
            description="Boundaries that prevent scope creep or unsafe expectations."
            eyebrow="Exclusions"
            items={draft.exclusions}
            placeholder="New proposal exclusion."
            title="Clarify what v1 does not include."
            onChange={(exclusions) => setDraft((current) => ({ ...current, exclusions }))}
          />
        </section>

        <ExportPanel markdown={markdown} promptPackJson={promptPackJson} proposalJson={proposalJson} />
      </main>
    </div>
  );
}

export default App;
