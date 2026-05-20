type EditableListProps = {
  title: string;
  eyebrow: string;
  description: string;
  items: string[];
  addLabel: string;
  placeholder: string;
  onChange: (items: string[]) => void;
};

export function EditableList({ title, eyebrow, description, items, addLabel, placeholder, onChange }: EditableListProps) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function addItem() {
    onChange([...items, placeholder]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <section className="panel list-panel">
      <div className="panel-header">
        <div>
          <p>{eyebrow}</p>
          <h3>{title}</h3>
          <small>{description}</small>
        </div>
        <button type="button" className="secondary-action" onClick={addItem}>
          {addLabel}
        </button>
      </div>
      <div className="stacked-list">
        {items.map((item, index) => (
          <label key={`${title}-${index}`}>
            <span>Item {index + 1}</span>
            <textarea value={item} onChange={(event) => updateItem(index, event.target.value)} />
            {items.length > 1 ? (
              <button type="button" className="text-action" onClick={() => removeItem(index)}>
                Remove
              </button>
            ) : null}
          </label>
        ))}
      </div>
    </section>
  );
}
