import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PromptDetail from "./pages/PromptDetail";
import PromptForm from "./pages/PromptForm";
import Account from "./pages/Account";
import AdminCategories from "./pages/AdminCategories";
import Members from "./pages/Members";
import Member from "./pages/Member";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="empty-state">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
// Pages for admins only. The server checks the role again on every request.
function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="empty-state">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin")
    return (
      <main className="empty-state">
        <h2>Admins only</h2>
        <p>You need an admin account to open this page.</p>
        <Link to="/">Return home</Link>
      </main>
    );
  return children;
}
function Layout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/users" element={<Members />} />
        <Route path="/users/:id" element={<Member />} />
        <Route path="/prompts/:id" element={<PromptDetail />} />
        <Route
          path="/create"
          element={
            <Protected>
              <PromptForm />
            </Protected>
          }
        />
        <Route
          path="/prompts/:id/edit"
          element={
            <Protected>
              <PromptForm edit />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route
          path="/account"
          element={
            <Protected>
              <Account />
            </Protected>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminOnly>
              <AdminCategories />
            </AdminOnly>
          }
        />
        <Route
          path="*"
          element={
            <main className="empty-state">
              <h2>Page not found</h2>
              <Link to="/">Return home</Link>
            </main>
          }
        />
      </Routes>
      <footer className="footer">
        PromptVault <span>Built for sharing better AI prompts.</span>
      </footer>
    </>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
