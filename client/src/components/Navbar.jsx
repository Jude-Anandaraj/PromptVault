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
          {user && (
            <NavLink to="/create" className="create-link">
              <Plus size={16} /> Create prompt
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/categories" className="create-link">
              <Tag size={15} /> Categories
            </NavLink>
          )}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <Link to="/account" className="user-label" title="Account settings">
                <UserRound size={15} /> {user.name}
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
