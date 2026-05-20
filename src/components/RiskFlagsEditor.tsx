import type { RiskFlag, RiskSeverity } from "../lib/proposalTypes.js";

const severities: RiskSeverity[] = ["Low", "Medium", "High"];

type RiskFlagsEditorProps = {
  riskFlags: RiskFlag[];
  onChange: (riskFlags: RiskFlag[]) => void;
};

export function RiskFlagsEditor({ riskFlags, onChange }: RiskFlagsEditorProps) {
  function updateRisk(id: string, patch: Partial<RiskFlag>) {
    onChange(riskFlags.map((risk) => (risk.id === id ? { ...risk, ...patch } : risk)));
  }

  function addRisk() {
    onChange([
      ...riskFlags,
      {
        id: `risk-${Date.now()}`,
        label: "New risk flag",
        severity: "Medium",
        mitigation: "Add a practical mitigation or decision owner.",
      },
    ]);
  }

  function removeRisk(id: string) {
    onChange(riskFlags.filter((risk) => risk.id !== id));
  }

  return (
    <section id="risks" className="panel">
      <div className="panel-header">
        <div>
          <p>Risk flags</p>
          <h3>Surface blockers before the proposal goes out.</h3>
        </div>
        <button type="button" className="secondary-action" onClick={addRisk}>
          Add risk
        </button>
      </div>
      <div className="risk-list">
        {riskFlags.map((risk) => (
          <article key={risk.id} className={`risk-card ${risk.severity.toLowerCase()}`}>
            <label>
              <span>Risk</span>
              <input value={risk.label} onChange={(event) => updateRisk(risk.id, { label: event.target.value })} />
            </label>
            <label>
              <span>Severity</span>
              <select value={risk.severity} onChange={(event) => updateRisk(risk.id, { severity: event.target.value as RiskSeverity })}>
                {severities.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Mitigation</span>
              <textarea value={risk.mitigation} onChange={(event) => updateRisk(risk.id, { mitigation: event.target.value })} />
            </label>
            {riskFlags.length > 1 ? (
              <button type="button" className="text-action" onClick={() => removeRisk(risk.id)}>
                Remove risk
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
