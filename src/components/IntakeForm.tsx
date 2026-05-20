import type { ProposalIntake } from "../lib/proposalTypes.js";

type TextField = Exclude<keyof ProposalIntake, "systems">;

const intakeFields: Array<{ key: TextField; label: string; multiline?: boolean }> = [
  { key: "projectTitle", label: "Project title" },
  { key: "clientName", label: "Client name" },
  { key: "industry", label: "Industry" },
  { key: "audience", label: "Decision audience" },
  { key: "problem", label: "Problem to solve", multiline: true },
  { key: "goal", label: "Target outcome", multiline: true },
  { key: "currentWorkflow", label: "Current workflow", multiline: true },
  { key: "budgetSignal", label: "Budget signal", multiline: true },
  { key: "timelinePreference", label: "Timeline preference" },
  { key: "successMetric", label: "Success metric", multiline: true },
];

type IntakeFormProps = {
  intake: ProposalIntake;
  onChange: (intake: ProposalIntake) => void;
};

export function IntakeForm({ intake, onChange }: IntakeFormProps) {
  function updateField<Key extends keyof ProposalIntake>(key: Key, value: ProposalIntake[Key]) {
    onChange({ ...intake, [key]: value });
  }

  return (
    <section id="intake" className="panel intake-panel">
      <div className="section-heading compact">
        <p>Intake form</p>
        <h2>Turn a rough opportunity into a scoping brief.</h2>
      </div>
      <div className="form-grid">
        {intakeFields.map((field) => (
          <label key={field.key} className={field.multiline ? "span-2" : undefined}>
            <span>{field.label}</span>
            {field.multiline ? (
              <textarea value={intake[field.key]} onChange={(event) => updateField(field.key, event.target.value)} />
            ) : (
              <input value={intake[field.key]} onChange={(event) => updateField(field.key, event.target.value)} />
            )}
          </label>
        ))}
        <label className="span-2">
          <span>Systems and data touchpoints</span>
          <input
            value={intake.systems.join(", ")}
            onChange={(event) =>
              updateField(
                "systems",
                event.target.value
                  .split(",")
                  .map((system) => system.trim())
                  .filter(Boolean),
              )
            }
            placeholder="CRM, spreadsheet, website form..."
          />
        </label>
      </div>
    </section>
  );
}
