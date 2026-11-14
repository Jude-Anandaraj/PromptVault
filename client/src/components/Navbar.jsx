import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Plus, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
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
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <span className="user-label">
                <UserRound size={15} /> {user.name}
              </span>
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
