import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, UsersRound } from "lucide-react";
import PromptCard from "../components/PromptCard";
import { api } from "../services/api";

export default function Member() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.member(id)
      .then((data) => {
        if (!active) return;
        setMember(data.user);
        setPrompts(data.prompts || []);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <main className="content empty-state" role="status">Loading member...</main>;
  if (error) {
    return (
      <main className="content">
        <div className="alert error" role="alert">{error}</div>
        <Link to="/users" className="back-link"><ArrowLeft size={16} /> Back to users</Link>
      </main>
    );
  }

  return (
    <main className="content member-page">
      <Link to="/users" className="back-link"><ArrowLeft size={16} /> Back to users</Link>
      <section className="member-heading">
        <span className="member-mark member-mark-large" aria-hidden="true">{member.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <span className="eyebrow"><UsersRound size={14} /> COMMUNITY MEMBER</span>
          <h1>{member.name}</h1>
          <p className="muted">Member since {new Date(member.createdAt).toLocaleDateString()}</p>
        </div>
      </section>
      <div className="section-heading member-prompts-heading">
        <div>
          <span className="eyebrow">PUBLIC CONTRIBUTIONS</span>
          <h2>{member.name.split(" ")[0]}'s prompts</h2>
        </div>
        <span className="result-count">{member.promptCount} {member.promptCount === 1 ? "prompt" : "prompts"}</span>
      </div>
      {prompts.length ? (
        <div className="prompt-grid">
          {prompts.map((prompt) => <PromptCard key={prompt._id} prompt={prompt} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No public prompts yet</h2>
          <p>This member has not shared a prompt.</p>
        </div>
      )}
    </main>
  );
}