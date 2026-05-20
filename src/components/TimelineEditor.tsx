import type { TimelinePhase } from "../lib/proposalTypes.js";

type TimelineEditorProps = {
  timeline: TimelinePhase[];
  onChange: (timeline: TimelinePhase[]) => void;
};

export function TimelineEditor({ timeline, onChange }: TimelineEditorProps) {
  function updatePhase(id: string, patch: Partial<TimelinePhase>) {
    onChange(timeline.map((phase) => (phase.id === id ? { ...phase, ...patch } : phase)));
  }

  function addPhase() {
    onChange([
      ...timeline,
      {
        id: `phase-${Date.now()}`,
        title: "New phase",
        duration: "TBD",
        owner: "Fox & Hen",
        description: "Describe the milestone and decision point.",
      },
    ]);
  }

  return (
    <section id="timeline" className="panel">
      <div className="panel-header">
        <div>
          <p>Timeline</p>
          <h3>Sequence milestones and owners.</h3>
        </div>
        <button type="button" className="secondary-action" onClick={addPhase}>
          Add phase
        </button>
      </div>
      <div className="timeline-list">
        {timeline.map((phase, index) => (
          <article key={phase.id} className="timeline-card">
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <div className="form-grid tight">
              <label>
                <span>Phase</span>
                <input value={phase.title} onChange={(event) => updatePhase(phase.id, { title: event.target.value })} />
              </label>
              <label>
                <span>Duration</span>
                <input value={phase.duration} onChange={(event) => updatePhase(phase.id, { duration: event.target.value })} />
              </label>
              <label>
                <span>Owner</span>
                <input value={phase.owner} onChange={(event) => updatePhase(phase.id, { owner: event.target.value })} />
              </label>
              <label className="span-2">
                <span>Description</span>
                <textarea value={phase.description} onChange={(event) => updatePhase(phase.id, { description: event.target.value })} />
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
