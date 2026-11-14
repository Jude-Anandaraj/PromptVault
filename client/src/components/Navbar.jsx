import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Plus, LogOut, UserRound, Tag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  return (
    <header className="topbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Sparkles size={19} />
          </span>
          PromptVault
        </Link>
        <nav>
          <NavLink to="/" end>
            Explore
          </NavLink>
          {/* On phones only the icons show, so the links keep their names in aria-label and title. */}
          {user && (
            <NavLink to="/create" className="create-link" aria-label="Create prompt" title="Create prompt">
              <Plus size={16} /> <span className="nav-text">Create prompt</span>
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/categories" className="create-link" aria-label="Categories" title="Categories">
              <Tag size={15} /> <span className="nav-text">Categories</span>
            </NavLink>
          )}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <Link to="/account" className="user-label" title="Account settings" aria-label={`Account settings for ${user.name}`}>
                <UserRound size={15} /> <span className="user-name">{user.name}</span>
                {isAdmin && <span className="role-badge">Admin</span>}
              </Link>
              <button
                className="icon-button"
                title="Log out"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Log in
              </Link>
              <Link to="/register" className="button button-small">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
