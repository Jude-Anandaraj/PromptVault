import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UsersRound } from "lucide-react";
import { api } from "../services/api";

export default function Members() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.members()
      .then(({ users: results }) => {
        if (active) setUsers(results || []);
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
  }, []);

  return (
    <main className="content member-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE PROMPTVAULT COMMUNITY</span>
          <h1>People sharing what works</h1>
        </div>
        {!loading && !error && <span className="result-count">{users.length} members</span>}
      </div>
      {error && <div className="alert error" role="alert">{error}</div>}
      {loading ? (
        <div className="empty-state" role="status">Loading members...</div>
      ) : error ? null : users.length ? (
        <div className="member-grid">
          {users.map((user) => (
            <Link className="member-card" to={`/users/${user.id}`} key={user.id}>
              <span className="member-mark" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
              <span className="member-card-copy">
                <strong>{user.name}</strong>
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </span>
              <UsersRound size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <UsersRound size={25} aria-hidden="true" />
          <h2>No members yet</h2>
          <p>New community members will appear here.</p>
        </div>
      )}
    </main>
  );
}