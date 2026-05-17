// All time slots in a day
const TIME_SLOTS = [
  "8-9am", "9-10am", "10-11am", "11-12pm",
  "2-3pm", "3-4pm", "4-5pm",
  "7-8pm", "8-9pm",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Give each subject a consistent color
const SUBJECT_COLORS = [
  "#FFD6E7", "#D6E4FF", "#D6FFE4", "#FFF3D6",
  "#F0D6FF", "#FFE4D6", "#D6FFFA",
];

export default function Timetable({ timetable }) {
  // Build a color map: subject name → color
  const colorMap = {};
  let colorIndex = 0;

  DAYS.forEach((day) => {
    const dayData = timetable[day] || {};
    Object.values(dayData).forEach((cell) => {
      if (cell && cell !== "—") {
        // Extract just the subject name (before the dash)
        const subject = cell.split(" - ")[0].trim();
        if (!colorMap[subject]) {
          colorMap[subject] = SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length];
          colorIndex++;
        }
      }
    });
  });

  return (
    <div className="timetable-wrapper">
      <h2 className="timetable-title">🗓️ Your AI-Generated Timetable</h2>
      <div className="table-scroll">
        <table className="timetable">
          {/* Header row: Time | Mon | Tue | ... */}
          <thead>
            <tr>
              <th className="time-header">⏰ Time</th>
              {DAYS.map((day) => (
                <th key={day} className="day-header">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body: one row per time slot */}
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot}>
                <td className="time-cell">{slot}</td>
                {DAYS.map((day) => {
                  const cell = timetable[day]?.[slot];
                  const subject = cell ? cell.split(" - ")[0].trim() : null;
                  const bgColor = subject ? colorMap[subject] : "transparent";

                  return (
                    <td
                      key={day}
                      className="subject-cell"
                      style={{ backgroundColor: bgColor }}
                    >
                      {cell || ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}