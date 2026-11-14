import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { api, clearToken } from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Account() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    newPassword: "",
    currentPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  // Changing the email or password needs the current password.
  const needsPassword =
    form.email.trim().toLowerCase() !== user.email || form.newPassword !== "";
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    // Only send what changed. An empty new password means "keep the current one".
    const body = { name: form.name.trim() };
    if (form.email.trim().toLowerCase() !== user.email) body.email = form.email.trim();
    if (form.newPassword) body.newPassword = form.newPassword;
    if (needsPassword) body.currentPassword = form.currentPassword;
    try {
      const data = await api.updateProfile(body);
      updateUser(data.user);
      setForm({ name: data.user.name, email: data.user.email, newPassword: "", currentPassword: "" });
      setMessage("Your profile has been updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(e) {
    e.preventDefault();
    if (!confirm("Delete your account and all your prompts? This cannot be undone.")) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await api.deleteAccount(deletePassword);
      // Forget the login and reload on the Explore page. (Signing out first would
      // make this login-only page redirect to /login before the navigation happens.)
      clearToken();
      window.location.replace("/");
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  }
  return (
    <main className="form-wrap">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to Explore
      </Link>
      <div className="form-card">
        <span className="eyebrow">YOUR ACCOUNT</span>
        <h1>Account settings</h1>
        <p className="muted">Update your name, email or password.</p>
        <form onSubmit={save}>
          <label>
            Your name
            <input name="name" value={form.name} onChange={change} required minLength="2" maxLength="50" />
          </label>
          <label>
            Email address
            <input name="email" type="email" value={form.email} onChange={change} required />
          </label>
          <label>
            New password <span className="muted-inline">(leave empty to keep your current one)</span>
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={change}
              minLength="8"
              maxLength="72"
              autoComplete="new-password"
            />
          </label>
          {needsPassword && (
            <label>
              Current password <span className="muted-inline">(needed to change your email or password)</span>
              <input
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={change}
                required
                autoComplete="current-password"
              />
            </label>
          )}
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}
          <button className="button" disabled={busy}>
            {busy ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
      <div className="form-card danger-card">
        <h2>Delete account</h2>
        <p className="muted">This permanently deletes your account and every prompt you have published.</p>
        <form onSubmit={remove}>
          <label>
            Password
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {deleteError && <div className="alert error">{deleteError}</div>}
          <button className="button button-danger" disabled={deleting}>
            <Trash2 size={15} /> {deleting ? "Deleting..." : "Delete my account"}
          </button>
        </form>
      </div>
    </main>
  );
}
