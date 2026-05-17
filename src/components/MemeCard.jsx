export default function MemeCard({ meme, tips }) {
  return (
    <div className="meme-section">
      {/* Meme Box */}
      <div className="meme-card">
        <p className="meme-top">{meme.top}</p>
        <div className="meme-emoji">{meme.emoji}</div>
        <p className="meme-bottom">{meme.bottom}</p>
        <span className="meme-label">AI-Generated Study Meme 😂</span>
      </div>

      {/* AI Tips Box */}
      <div className="tips-card">
        <h3>💡 AI Study Tips</h3>
        <ul>
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}