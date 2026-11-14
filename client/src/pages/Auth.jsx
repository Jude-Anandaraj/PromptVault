import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = isRegister
        ? await api.register(form)
        : await api.login({ email: form.email, password: form.password });
      signIn(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon">
            <Sparkles />
          </span>
          <span className="eyebrow">PROMPTVAULT</span>
        </div>
        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {isRegister
            ? "Join the community and save your best ideas."
            : "Log in to create and manage your prompts."}
        </p>
        <form onSubmit={submit}>
          {isRegister && (
            <label>
              Your name
              <input
                name="name"
                value={form.name}
                onChange={change}
                required
                minLength="2"
                maxLength="50"
                placeholder="Your name"
              />
            </label>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={change}
              required
              minLength="8"
              maxLength="72"
              placeholder="At least 8 characters"
            />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="button full" disabled={busy}>
            {busy ? "Please wait..." : isRegister ? "Create account" : "Log in"}
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New to PromptVault?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </main>
  );
}
