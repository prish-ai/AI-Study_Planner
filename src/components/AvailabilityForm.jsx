import { useState } from "react";

const HOURS = [
  "8am", "9am", "10am", "11am", "12pm",
  "1pm", "2pm", "3pm", "4pm", "5pm",
  "6pm", "7pm", "8pm", "9pm"
];

export default function AvailabilityForm({ onSave }) {
  const [open, setOpen] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [current, setCurrent] = useState({ date: "", from: "8am", to: "10am", reason: "" });

  function addBlock() {
    if (!current.date || !current.from || !current.to) {
      alert("Please select a date, from time and to time!");
      return;
    }
    if (current.from === current.to) {
      alert("From and To time can't be the same!");
      return;
    }
    setBlocks([...blocks, { ...current }]);
    setCurrent({ date: "", from: "8am", to: "10am", reason: "" });
  }

  function removeBlock(index) {
    setBlocks(blocks.filter((_, i) => i !== index));
  }

  function handleSave() {
    onSave(blocks);
    setOpen(false);
  }

  // Format date nicely e.g. "Mon, 20 Jan"
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  }

  return (
    <div className="availability-wrapper">
      {/* Toggle Button */}
      <button className="availability-toggle" onClick={() => setOpen(!open)}>
        {open ? "✕ Close" : "🗓️ Block Busy Dates & Times"}
        {blocks.length > 0 && !open && (
          <span className="block-count">{blocks.length} block{blocks.length > 1 ? "s" : ""} set</span>
        )}
      </button>

      {open && (
        <div className="availability-panel">
          <h3 className="avail-title">🚫 Block Your Busy Times</h3>
          <p className="avail-subtitle">
            Pick specific dates and hours — AI will avoid scheduling during these times
          </p>

          {/* Add a block */}
          <div className="block-form">
            <div className="three-col">
              {/* Date picker */}
              <div className="input-group">
                <label>📅 Date</label>
                <input
                  type="date"
                  value={current.date}
                  onChange={(e) => setCurrent({ ...current, date: e.target.value })}
                />
              </div>

              {/* From time */}
              <div className="input-group">
                <label>⏰ From</label>
                <select
                  value={current.from}
                  onChange={(e) => setCurrent({ ...current, from: e.target.value })}
                >
                  {HOURS.map((h) => <option key={h}>{h}</option>)}
                </select>
              </div>

              {/* To time */}
              <div className="input-group">
                <label>⏰ To</label>
                <select
                  value={current.to}
                  onChange={(e) => setCurrent({ ...current, to: e.target.value })}
                >
                  {HOURS.map((h) => <option key={h}>{h}</option>)}
                </select>
              </div>
            </div>

            {/* Reason */}
            <div className="input-group">
              <label>Reason (optional)</label>
              <input
                type="text"
                placeholder="e.g. Football practice, Family dinner, Doctor appointment..."
                value={current.reason}
                onChange={(e) => setCurrent({ ...current, reason: e.target.value })}
              />
            </div>

            <button className="add-block-btn" onClick={addBlock}>
              + Add Block
            </button>
          </div>

          {/* List of added blocks */}
          {blocks.length > 0 && (
            <div className="blocks-list">
              <p className="blocks-label">⛔ Blocked Times ({blocks.length})</p>
              {blocks
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((block, i) => (
                  <div key={i} className="block-tag">
                    <span>
                      📅 <strong>{formatDate(block.date)}</strong>
                      &nbsp;·&nbsp;
                      ⏰ {block.from} – {block.to}
                      {block.reason && <em> · {block.reason}</em>}
                    </span>
                    <button onClick={() => removeBlock(i)} className="remove-block-btn">✕</button>
                  </div>
                ))}
            </div>
          )}

          <button className="save-avail-btn" onClick={handleSave}>
            ✅ Save & Apply to Timetable
          </button>
        </div>
      )}
    </div>
  );
}