import { useState } from "react";
import SubjectForm from "./components/SubjectForm";
import Timetable from "./components/Timetable";
import MemeCard from "./components/MemeCard";
import AvailabilityForm from "./components/AvailabilityForm";
import { generateTimetable } from "./api/claude";
import "./App.css";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busyBlocks, setBusyBlocks] = useState([]);

  async function handleGenerate(subjects) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateTimetable(subjects, busyBlocks);
      setResult(data);
      setTimeout(() => {
        document.getElementById("output")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check your API key in the .env file and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <p className="hero-tag">✨ Powered by Gemini AI</p>
          <h1 className="hero-title">
            Study Planner
            <span className="hero-italic"> that thinks</span>
          </h1>
          <p className="hero-desc">
            Add your subjects, topics & exam dates. AI builds your perfect weekly timetable.
          </p>
        </div>
        <div className="blob blob1" />
        <div className="blob blob2" />
      </header>

      <main className="main">
        <SubjectForm onGenerate={handleGenerate} loading={loading} />

        {/* Availability blocker — sits between form and generate */}
        <AvailabilityForm onSave={setBusyBlocks} />

        {busyBlocks.length > 0 && (
          <div className="busy-summary">
            🚫 <strong>{busyBlocks.length} busy block{busyBlocks.length > 1 ? "s" : ""}</strong> will be avoided in your timetable
          </div>
        )}

        {loading && (
          <div className="loading-box">
            <div className="spinner" />
            <p>AI is designing your perfect schedule... ✨</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <p>❌ {error}</p>
          </div>
        )}

        {result && (
          <div id="output" className="output-section">
            <Timetable timetable={result.timetable} />
            <MemeCard meme={result.meme} tips={result.tips} />
          </div>
        )}
      </main>

      <footer className="footer">
        Made with 💗 + Gemini AI · Study smart, not hard
      </footer>
    </div>
  );
}