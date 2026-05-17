import axios from "axios";

export async function generateTimetable(subjects, busyBlocks = []) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  console.log("API Key found:", apiKey ? "YES - " + apiKey.slice(0, 8) + "..." : "NO - KEY IS MISSING");

  if (!apiKey) {
    throw new Error("API key is missing from .env file");
  }
const busySection = busyBlocks.length > 0
    ? `
IMPORTANT - The student is BUSY on these specific dates and times. Do NOT schedule anything during these periods:
${busyBlocks.map((b) => {
  const d = new Date(b.date);
  const dayName = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
  return `- ${dayName} from ${b.from} to ${b.to}${b.reason ? ` (reason: ${b.reason})` : ""}`;
}).join("\n")}
`
    : "";

  const prompt = `
You are an expert academic planner. A student has given you their study data below.
Your job is to create an OPTIMAL weekly timetable for them.

Here is their study data:
${JSON.stringify(subjects, null, 2)}

${busySection}

Rules for the timetable:
- Schedule harder/higher-priority subjects in the morning (8-9am to 11-12pm)
- Leave afternoons (2-3pm to 4-5pm) for medium priority subjects
- Put revision and easy topics in the evening (7-8pm to 8-9pm)
- Give each subject at least 1 day off per week
- Higher priority number (closer to 10) means appears more frequently
- Subjects with closer exam dates should appear more often
- STRICTLY avoid any blocked/busy times listed above

Respond with ONLY a valid JSON object. No explanation, no markdown, no backticks, just raw JSON.

The JSON format must be exactly this:
{
  "timetable": {
    "Monday": { "8-9am": "Subject - Topic", "9-10am": "Subject - Topic" },
    "Tuesday": { "8-9am": "Subject - Topic" },
    "Wednesday": { "8-9am": "Subject - Topic" },
    "Thursday": { "8-9am": "Subject - Topic" },
    "Friday": { "8-9am": "Subject - Topic" },
    "Saturday": { "8-9am": "Subject - Topic" },
    "Sunday": { "8-9am": "Rest / Light Revision" }
  },
  "tips": ["tip1", "tip2", "tip3"],
  "meme": {
    "top": "funny relatable study text",
    "bottom": "punchline 😂",
    "emoji": "😭"
  }
}

Available time slots: 8-9am, 9-10am, 10-11am, 11-12pm, 2-3pm, 3-4pm, 4-5pm, 7-8pm, 8-9pm
Not every slot needs to be filled. Leave gaps for breaks.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    console.log("Gemini response:", response.data);

    const rawText = response.data.candidates[0].content.parts[0].text;
    console.log("Raw text:", rawText);

    try {
      return JSON.parse(rawText);
    } catch (e) {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    }

  } catch (err) {
    console.error("Full error:", err.response?.data || err.message);
    throw err;
  }
}