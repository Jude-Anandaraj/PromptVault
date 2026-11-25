import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Pencil, Settings, Trash2, UserRound } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let active = true;
    api.myPrompts()
      .then(({ prompts: results }) => {
        if (active) setPrompts(results || []);
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) {
          signOut();
          navigate("/login", { replace: true });
          return;
        }
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function removePrompt(id) {
    if (!confirm("Delete this prompt? This cannot be undone.")) return;
    setDeletingId(id);
    setError("");
    try {
      await api.deletePrompt(id);
      setPrompts((current) => current.filter((prompt) => prompt._id !== id));
    } catch (err) {
      if (err.status === 401) {
        signOut();
        navigate("/login", { replace: true });
        return;
      }
      setError(err.message);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="content profile-page">
      <span className="eyebrow"><UserRound size={14} /> YOUR PROMPTVAULT</span>
      <div className="profile-heading">
        <div>
          <h1>{user.name}</h1>
          <p className="muted">Your profile and published prompts.</p>
        </div>
        <Link to="/account" className="button button-outline button-small">
          <Settings size={15} /> Account settings
        </Link>
      </div>
      <section className="profile-details" aria-label="Your profile details">
        <div><span>Name</span><strong>{user.name}</strong></div>
        <div><span>Email</span><strong>{user.email}</strong></div>
        {user.createdAt && (
          <div><span>Member since</span><strong><CalendarDays size={15} /> {new Date(user.createdAt).toLocaleDateString()}</strong></div>
        )}
      </section>
      <div className="section-heading profile-prompts-heading">
        <div>
          <span className="eyebrow">YOUR CONTRIBUTIONS</span>
          <h2>Your prompts</h2>
        </div>
        {!loading && !error && <span className="result-count">{prompts.length} prompts</span>}
      </div>
      {error && <div className="alert error" role="alert">{error}</div>}
      {loading ? (
        <div className="empty-state" role="status">Loading your prompts...</div>
      ) : error ? null : prompts.length ? (
        <div className="owned-prompt-list">
          {prompts.map((prompt) => (
            <article className="owned-prompt" key={prompt._id}>
              <div className="owned-prompt-copy">
                <span className="category-pill">{prompt.category || "Uncategorized"}</span>
                <h3><Link to={`/prompts/${prompt._id}`}>{prompt.title} <ArrowUpRight size={15} aria-hidden="true" /></Link></h3>
                <p>{prompt.description}</p>
              </div>
              <div className="owned-prompt-actions">
                <Link className="button button-outline button-small" to={`/prompts/${prompt._id}/edit`}>
                  <Pencil size={14} /> Edit
                </Link>
                <button className="button button-danger button-small" onClick={() => removePrompt(prompt._id)} disabled={deletingId === prompt._id}>
                  <Trash2 size={14} /> {deletingId === prompt._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>You have not published any prompts</h3>
          <p>Your published prompts will appear here.</p>
          <Link to="/create" className="button button-small">Create a prompt</Link>
        </div>
      )}
    </main>
  );
}