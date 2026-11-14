import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import PromptCard from "../components/PromptCard";
import { api } from "../services/api";
export default function Home() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [prompts, setPrompts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api
      .categories()
      .then((d) => {
        if (active) setCategories(d.categories || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .prompts(q, category)
      .then((d) => {
        if (active) setPrompts(d.prompts || []);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [q, category]);
  const filters = [
    "All",
    ...new Set([...categories, ...(category !== "All" ? [category] : [])]),
  ];
  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="eyebrow">
            <Sparkles size={14} /> YOUR AI WORKSPACE
          </span>
          <h1>
            Find the prompt.
            <br />
            <span>Unlock the idea.</span>
          </h1>
          <p>
            Discover useful prompts, share what works, and build better things
            with AI.
          </p>
          <div className="search-box">
            <Search size={19} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search prompts, topics, or ideas..."
            />
            {q && <button onClick={() => setQ("")}>Clear</button>}
          </div>
        </div>
      </section>
      <main className="content">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE COMMUNITY LIBRARY</span>
            <h2>Explore prompts</h2>
          </div>
          <span className="result-count">{prompts.length} prompts</span>
        </div>
        <div className="filters">
          {filters.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`filter ${category === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
          {(q || category !== "All") && (
            <button
              className="filter"
              onClick={() => {
                setQ("");
                setCategory("All");
              }}
            >
              Reset filters
            </button>
          )}
        </div>
        {error && (
          <div className="alert error">
            {error} Make sure the backend is running.
          </div>
        )}
        {loading ? (
          <div className="empty-state">Loading prompts...</div>
        ) : prompts.length ? (
          <div className="prompt-grid">
            {prompts.map((p) => (
              <PromptCard key={p._id} prompt={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Sparkles size={25} />
            <h3>No prompts found</h3>
            <p>Try another search or choose a different category.</p>
          </div>
        )}
      </main>
    </>
  );
}
