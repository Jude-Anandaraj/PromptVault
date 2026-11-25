import { Link, NavLink, useNavigate } from "react-router-dom";
import { Plus, LogOut, UserRound, Tag, UsersRound, CircleUserRound, Compass } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  return (
    <header className="topbar">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="PromptVault home">
          <span>PromptVault</span>
        </Link>
        <nav>
          <NavLink to="/" end aria-label="Explore" title="Explore">
            <Compass size={16} /> <span className="nav-text">Explore</span>
          </NavLink>
          <NavLink to="/users" className="create-link" aria-label="Users" title="Users">
            <UsersRound size={16} /> <span className="nav-text">Users</span>
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
          {user && (
            <NavLink to="/profile" className="create-link" aria-label="My profile" title="My profile">
              <CircleUserRound size={16} /> <span className="nav-text">My profile</span>
            </NavLink>
          )}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <Link to="/profile" className="user-label" title="My profile" aria-label={`My profile: ${user.name}`}>
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
                Sign In
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
