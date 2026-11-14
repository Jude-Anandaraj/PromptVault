import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../services/api";
const emptyForm = { name: "", description: "" };
const byName = (list) => [...list].sort((a, b) => a.name.localeCompare(b.name));
// Admin page: add, rename and delete categories.
export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  useEffect(() => {
    api
      .adminCategories()
      .then((data) => setCategories(data.categories))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  function done(text) {
    setMessage(text);
    setError("");
  }
  function failed(err) {
    setError(err.message);
    setMessage("");
  }
  async function add(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { category } = await api.createCategory({
        name: form.name.trim(),
        description: form.description.trim(),
      });
      setCategories((list) => byName([...list, category]));
      setForm(emptyForm);
      done(`Added "${category.name}".`);
    } catch (err) {
      failed(err);
    } finally {
      setBusy(false);
    }
  }
  function startEdit(category) {
    setEditingId(category._id);
    setEditForm({ name: category.name, description: category.description });
    setMessage("");
    setError("");
  }
  async function saveEdit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { category } = await api.updateCategory(editingId, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
      });
      setCategories((list) => byName(list.map((c) => (c._id === category._id ? category : c))));
      setEditingId(null);
      done(`Saved "${category.name}".`);
    } catch (err) {
      failed(err);
    } finally {
      setBusy(false);
    }
  }
  async function remove(category) {
    if (!confirm(`Delete the category "${category.name}"?`)) return;
    setBusy(true);
    try {
      await api.deleteCategory(category._id);
      setCategories((list) => list.filter((c) => c._id !== category._id));
      done(`Deleted "${category.name}".`);
    } catch (err) {
      failed(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="form-wrap admin-wrap">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to Explore
      </Link>
      <div className="form-card">
        <span className="eyebrow">ADMIN</span>
        <h1>Categories</h1>
        <p className="muted">
          Categories appear in the Explore filters and in the prompt form. A category can only be
          deleted when no prompts use it.
        </p>
        <form onSubmit={add}>
          <label>
            New category name
            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              minLength="2"
              maxLength="40"
              placeholder="e.g. Business"
            />
          </label>
          <label>
            Description <span className="muted-inline">(optional)</span>
            <input
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength="200"
              placeholder="What kind of prompts belong here?"
            />
          </label>
          <button className="button" disabled={busy}>
            <Plus size={15} /> Add category
          </button>
        </form>
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}
        {loading ? (
          <p className="muted">Loading categories...</p>
        ) : (
          <ul className="category-list">
            {categories.map((c) => (
              <li key={c._id} className="category-row">
                {editingId === c._id ? (
                  <form onSubmit={saveEdit} className="category-edit">
                    <input
                      aria-label="Category name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      minLength="2"
                      maxLength="40"
                    />
                    <input
                      aria-label="Description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      maxLength="200"
                      placeholder="Description (optional)"
                    />
                    <div className="category-actions">
                      <button className="button button-small" disabled={busy}>
                        Save
                      </button>
                      <button
                        type="button"
                        className="button button-outline button-small"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="category-info">
                      <strong>{c.name}</strong>
                      {c.description && <span>{c.description}</span>}
                      <span className="category-count">
                        {c.promptCount} prompt{c.promptCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="category-actions">
                      <button
                        className="button button-outline button-small"
                        onClick={() => startEdit(c)}
                        disabled={busy}
                      >
                        <Pencil size={14} /> Rename
                      </button>
                      <button
                        className="button button-danger button-small"
                        onClick={() => remove(c)}
                        disabled={busy || c.promptCount > 0}
                        title={c.promptCount > 0 ? "Move or delete its prompts first" : "Delete this category"}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
