import { useState, useEffect } from "react";

const blankTopic = { name: "", priority: 5 };

const blankSubject = {
  name: "",
  topics: [{ ...blankTopic }],
  subjectPriority: 5,
  examDate: "",
  finishBy: "",
};

export default function SubjectForm({ onGenerate, loading }) {
  const [subjects, setSubjects] = useState([{ ...blankSubject }]);

  function updateSubject(sIndex, field, value) {
    const updated = [...subjects];
    updated[sIndex][field] = value;
    setSubjects(updated);
  }

  function updateTopic(sIndex, tIndex, field, value) {
    const updated = [...subjects];
    updated[sIndex].topics[tIndex][field] = value;
    setSubjects(updated);
  }

  function addTopic(sIndex) {
    const updated = [...subjects];
    updated[sIndex].topics.push({ ...blankTopic });
    setSubjects(updated);
  }

  function removeTopic(sIndex, tIndex) {
    const updated = [...subjects];
    updated[sIndex].topics = updated[sIndex].topics.filter((_, i) => i !== tIndex);
    setSubjects(updated);
  }

  function addSubject() {
    setSubjects([...subjects, {
      name: "",
      topics: [{ ...blankTopic }],
      subjectPriority: 5,
      examDate: "",
      finishBy: "",
    }]);
  }

  function removeSubject(sIndex) {
    setSubjects(subjects.filter((_, i) => i !== sIndex));
  }

  function handleSubmit() {
    const filled = subjects.filter((s) => s.name.trim() !== "");
    if (filled.length === 0) {
      alert("Please add at least one subject!");
      return;
    }
    onGenerate(filled);
  }

  function sliderColor(val) {
    if (val <= 3) return "#52b788";
    if (val <= 6) return "#FFB703";
    return "#E63946";
  }

  function priorityLabel(val) {
    if (val <= 3) return "Low";
    if (val <= 6) return "Medium";
    return "High";
  }

  function updateSliderFill(slider, val, color) {
    const percent = ((val - 1) / 9) * 100;
    slider.style.background = `linear-gradient(to right, ${color} ${percent}%, #e9e0f5 ${percent}%)`;
  }

  // Sync all slider fills on every state change
  useEffect(() => {
    document.querySelectorAll(".priority-slider").forEach((slider) => {
      const val = Number(slider.value);
      const color = sliderColor(val);
      updateSliderFill(slider, val, color);
    });
  }, [subjects]);

  return (
    <div className="form-section">
      <h2 className="form-title">📚 Add Your Subjects</h2>
      <p className="form-subtitle">
        Use sliders to set priority — 1 is lowest, 10 is highest
      </p>

      {subjects.map((subject, sIndex) => (
        <div key={sIndex} className="subject-card">

          {/* Card Header */}
          <div className="card-header">
            <span className="card-number">Subject #{sIndex + 1}</span>
            {subjects.length > 1 && (
              <button className="remove-btn" onClick={() => removeSubject(sIndex)}>
                ✕ Remove Subject
              </button>
            )}
          </div>

          {/* Subject Name — plain text input, no slider logic here */}
          <div className="input-group">
            <label>Subject Name *</label>
            <input
              type="text"
              placeholder="e.g. Mathematics, Physics..."
              value={subject.name}
              onChange={(e) => updateSubject(sIndex, "name", e.target.value)}
            />
          </div>

          {/* Subject Priority Slider */}
          <div className="slider-group">
            <div className="slider-header">
              <label>Subject Priority</label>
              <span
                className="priority-badge"
                style={{ background: sliderColor(subject.subjectPriority) }}
              >
                {subject.subjectPriority}/10 — {priorityLabel(subject.subjectPriority)}
              </span>
            </div>
            <div className="slider-hints">
              <span>1 · Lowest</span>
              <span>10 · Highest</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={subject.subjectPriority}
              className="priority-slider"
              style={{ "--thumb-color": sliderColor(subject.subjectPriority) }}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateSliderFill(e.target, val, sliderColor(val));
                updateSubject(sIndex, "subjectPriority", val);
              }}
            />
          </div>

          {/* Topics Section */}
          <div className="topics-section">
            <p className="topics-label">📝 Topics</p>

            {subject.topics.map((topic, tIndex) => (
              <div key={tIndex} className="topic-block">
                <div className="topic-row">
                  {/* Topic Name — plain text input */}
                  <div className="input-group topic-name">
                    <label>Topic {tIndex + 1}</label>
                    <input
                      type="text"
                      placeholder="e.g. Calculus, Photosynthesis..."
                      value={topic.name}
                      onChange={(e) =>
                        updateTopic(sIndex, tIndex, "name", e.target.value)
                      }
                    />
                  </div>
                  {subject.topics.length > 1 && (
                    <button
                      className="remove-topic-btn"
                      onClick={() => removeTopic(sIndex, tIndex)}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Per-Topic Priority Slider */}
                <div className="slider-group topic-slider-group">
                  <div className="slider-header">
                    <label style={{ fontSize: "12px" }}>Topic Priority</label>
                    <span
                      className="priority-badge small-badge"
                      style={{ background: sliderColor(topic.priority) }}
                    >
                      {topic.priority}/10 — {priorityLabel(topic.priority)}
                    </span>
                  </div>
                  <div className="slider-hints">
                    <span>1 · Lowest</span>
                    <span>10 · Highest</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={topic.priority}
                    className="priority-slider"
                    style={{ "--thumb-color": sliderColor(topic.priority) }}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateSliderFill(e.target, val, sliderColor(val));
                      updateTopic(sIndex, tIndex, "priority", val);
                    }}
                  />
                </div>
              </div>
            ))}

            <button className="add-topic-btn" onClick={() => addTopic(sIndex)}>
              + Add Topic
            </button>
          </div>

          {/* Dates */}
          <div className="two-col" style={{ marginTop: "16px" }}>
            <div className="input-group">
              <label>Exam Date</label>
              <input
                type="date"
                value={subject.examDate}
                onChange={(e) => updateSubject(sIndex, "examDate", e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Finish Syllabus By</label>
              <input
                type="date"
                value={subject.finishBy}
                onChange={(e) => updateSubject(sIndex, "finishBy", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="form-buttons">
        <button className="add-btn" onClick={addSubject}>
          + Add Another Subject
        </button>
        <button className="generate-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "✨ AI is thinking..." : "✨ Generate My Timetable"}
        </button>
      </div>
    </div>
  );
}