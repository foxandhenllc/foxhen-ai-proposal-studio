import { formatCurrency } from "../lib/proposalEngine.js";
import type { EstimateInputs, ProposalPackage } from "../lib/proposalTypes.js";

const estimateFields: Array<{ key: keyof EstimateInputs; label: string; suffix: string }> = [
  { key: "discoveryHours", label: "Discovery", suffix: "hrs" },
  { key: "implementationHours", label: "Implementation", suffix: "hrs" },
  { key: "qaHours", label: "QA", suffix: "hrs" },
  { key: "projectManagementHours", label: "PM", suffix: "hrs" },
  { key: "hourlyRate", label: "Internal rate", suffix: "/hr" },
  { key: "marginPercent", label: "Margin target", suffix: "%" },
];

type EstimatePanelProps = {
  proposal: ProposalPackage;
  onEstimateChange: (estimate: EstimateInputs) => void;
};

export function EstimatePanel({ proposal, onEstimateChange }: EstimatePanelProps) {
  function updateEstimate(key: keyof EstimateInputs, value: number) {
    onEstimateChange({ ...proposal.estimate, [key]: Number.isFinite(value) ? value : 0 });
  }

  return (
    <aside id="estimate" className="panel estimate-panel">
      <div className="section-heading compact">
        <p>Complexity + estimate</p>
        <h2>Score scope and keep internal math separate.</h2>
      </div>
      <div className="score-strip">
        <article>
          <span>Complexity</span>
          <strong>{proposal.complexity.level}</strong>
          <small>{proposal.complexity.total} points</small>
        </article>
        <article>
          <span>Client range</span>
          <strong>{proposal.priceRange.label}</strong>
          <small>Shown in proposal export</small>
        </article>
        <article className="private">
          <span>Internal suggested price</span>
          <strong>{formatCurrency(proposal.internalEstimate.suggestedPrice)}</strong>
          <small>{formatCurrency(proposal.internalEstimate.marginAmount)} planned margin</small>
        </article>
      </div>
      <div className="driver-list">
        {proposal.complexity.drivers.map((driver) => (
          <span key={driver}>{driver}</span>
        ))}
      </div>
      <div className="estimate-grid">
        {estimateFields.map((field) => (
          <label key={field.key}>
            <span>{field.label}</span>
            <input
              min="0"
              type="number"
              value={proposal.estimate[field.key]}
              onChange={(event) => updateEstimate(field.key, Number(event.target.value))}
            />
            <small>{field.suffix}</small>
          </label>
        ))}
      </div>
      <div className="internal-notes" aria-label="Internal estimate notes">
        <strong>Internal estimate view</strong>
        <p>{proposal.internalEstimate.totalHours} total hours at {formatCurrency(proposal.internalEstimate.hourlyRate)}/hr.</p>
        {proposal.internalEstimate.notes.map((note) => (
          <small key={note}>{note}</small>
        ))}
      </div>
    </aside>
  );
}
