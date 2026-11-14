import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
const empty = {
  title: "",
  description: "",
  content: "",
  category: "",
  tags: "",
};
export default function PromptForm({ edit = false }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(edit);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    api
      .categories()
      .then(({ categories: items }) => setCategories(items || []))
      .catch(() => {});
    if (edit)
      api
        .prompt(id)
        .then(({ prompt }) => {
          if (String(user?.id) !== String(prompt.author?._id)) {
            navigate(`/prompts/${id}`, { replace: true });
            return;
          }
          setForm({ ...prompt, tags: (prompt.tags || []).join(", ") });
          setCategories((items) => [...new Set([...items, prompt.category])]);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
  }, [edit, id, navigate, user?.id]);
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      content: form.content.trim(),
      category: form.category.trim(),
      tags: form.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };
    if (!body.title || !body.description || !body.content || !body.category) {
      setError("Complete all required fields before saving.");
      setBusy(false);
      return;
    }
    try {
      const data = edit
        ? await api.updatePrompt(id, body)
        : await api.createPrompt(body);
      navigate(`/prompts/${data.prompt._id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return <main className="form-wrap empty-state">Loading prompt...</main>;
  return (
    <main className="form-wrap">
      <Link to={edit ? `/prompts/${id}` : "/"} className="back-link">
        <ArrowLeft size={16} /> Cancel
      </Link>
      <div className="form-card">
        <span className="eyebrow">
          {edit ? "UPDATE YOUR IDEA" : "CONTRIBUTE TO THE LIBRARY"}
        </span>
        <h1>{edit ? "Edit prompt" : "Create a prompt"}</h1>
        <p className="muted">
          Make it clear, useful, and easy for others to reuse.
        </p>
        <form onSubmit={submit}>
          <label>
            Prompt title
            <input
              name="title"
              value={form.title}
              onChange={change}
              required
              maxLength="100"
              placeholder="e.g. Product description writer"
            />
          </label>
          <label>
            Short description
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              required
              maxLength="500"
              rows="2"
              placeholder="What does this prompt help people do?"
            />
          </label>
          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={change}
              required
            >
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Prompt content
            <textarea
              className="prompt-input"
              name="content"
              value={form.content}
              onChange={change}
              required
              maxLength="12000"
              rows="9"
              placeholder="Write the full prompt here. Use [brackets] for details people should customize."
            />
          </label>
          <label>
            Tags <span className="muted-inline">(comma separated)</span>
            <input
              name="tags"
              value={form.tags}
              onChange={change}
              placeholder="writing, email, productivity"
            />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="button" disabled={busy}>
            {busy ? "Saving..." : edit ? "Save changes" : "Publish prompt"}
          </button>
        </form>
      </div>
    </main>
  );
}
