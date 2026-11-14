import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Check, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function PromptDetail() {
  const { id } = useParams();
  const [prompt, setPrompt] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    api
      .prompt(id)
      .then((d) => setPrompt(d.prompt))
      .catch((e) => setError(e.message));
  }, [id]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Clipboard access failed. Select and copy the text manually.");
    }
  }
  async function remove() {
    if (!confirm("Delete this prompt? This cannot be undone.")) return;
    try {
      await api.deletePrompt(id);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  }
  if (error && !prompt)
    return (
      <main className="content">
        <div className="alert error">{error}</div>
        <Link to="/">Back to Explore</Link>
      </main>
    );
  if (!prompt)
    return <main className="content empty-state">Loading prompt...</main>;
  const owner = user && String(user.id) === String(prompt.author?._id);
  return (
    <main className="detail-wrap">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to Explore
      </Link>
      <article className="detail-card">
        <div className="detail-head">
          <span className="category-pill">{prompt.category}</span>
          {owner && (
            <div className="detail-actions">
              <Link
                className="button button-outline button-small"
                to={`/prompts/${id}/edit`}
              >
                <Pencil size={14} /> Edit
              </Link>
              <button
                className="button button-danger button-small"
                onClick={remove}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
        <h1>{prompt.title}</h1>
        <p className="detail-description">{prompt.description}</p>
        <div className="byline">
          By {prompt.author?.name || "Community member"} ·{" "}
          {new Date(prompt.createdAt).toLocaleDateString()}
        </div>
        <div className="prompt-content-head">
          <h2>Prompt</h2>
          <button className="button button-small" onClick={copy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
            {copied ? "Copied" : "Copy prompt"}
          </button>
        </div>
        <pre className="prompt-content">{prompt.content}</pre>
        {prompt.tags?.length > 0 && (
          <div className="tag-list">
            {prompt.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        )}
        {error && <div className="alert error">{error}</div>}
      </article>
    </main>
  );
}
