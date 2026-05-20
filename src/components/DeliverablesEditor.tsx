import type { ProposalDeliverable } from "../lib/proposalTypes.js";

type DeliverablesEditorProps = {
  deliverables: ProposalDeliverable[];
  onChange: (deliverables: ProposalDeliverable[]) => void;
};

export function DeliverablesEditor({ deliverables, onChange }: DeliverablesEditorProps) {
  function updateDeliverable(id: string, patch: Partial<ProposalDeliverable>) {
    onChange(deliverables.map((deliverable) => (deliverable.id === id ? { ...deliverable, ...patch } : deliverable)));
  }

  function addDeliverable() {
    onChange([
      ...deliverables,
      {
        id: `deliverable-${Date.now()}`,
        title: "New deliverable",
        description: "Describe the client-visible output.",
        acceptanceCriteria: ["Add one acceptance criterion"],
      },
    ]);
  }

  function removeDeliverable(id: string) {
    onChange(deliverables.filter((deliverable) => deliverable.id !== id));
  }

  return (
    <section id="deliverables" className="panel">
      <div className="panel-header">
        <div>
          <p>Deliverables</p>
          <h3>Define what the client receives.</h3>
        </div>
        <button type="button" className="secondary-action" onClick={addDeliverable}>
          Add deliverable
        </button>
      </div>
      <div className="card-grid">
        {deliverables.map((deliverable) => (
          <article key={deliverable.id} className="editable-card">
            <label>
              <span>Title</span>
              <input value={deliverable.title} onChange={(event) => updateDeliverable(deliverable.id, { title: event.target.value })} />
            </label>
            <label>
              <span>Description</span>
              <textarea value={deliverable.description} onChange={(event) => updateDeliverable(deliverable.id, { description: event.target.value })} />
            </label>
            <label>
              <span>Acceptance criteria</span>
              <textarea
                value={deliverable.acceptanceCriteria.join("\n")}
                onChange={(event) =>
                  updateDeliverable(deliverable.id, {
                    acceptanceCriteria: event.target.value
                      .split("\n")
                      .map((criterion) => criterion.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            {deliverables.length > 1 ? (
              <button type="button" className="text-action" onClick={() => removeDeliverable(deliverable.id)}>
                Remove deliverable
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
