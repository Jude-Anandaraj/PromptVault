import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import PromptDetail from './pages/PromptDetail';
import PromptForm from './pages/PromptForm';
import { AuthProvider, useAuth } from './context/AuthContext';
function Protected({children}) { const {user,loading}=useAuth(); if(loading)return <div className="empty-state">Loading...</div>; return user?children:<Navigate to="/login" replace/>; }
function Layout(){return <><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/prompts/:id" element={<PromptDetail/>}/><Route path="/create" element={<Protected><PromptForm/></Protected>}/><Route path="/prompts/:id/edit" element={<Protected><PromptForm edit/></Protected>}/><Route path="*" element={<main className="empty-state"><h2>Page not found</h2><Link to="/">Return home</Link></main>}/></Routes><footer className="footer">PromptVault <span>Built for sharing better AI prompts.</span></footer></>}
export default function App(){return <AuthProvider><BrowserRouter><Layout/></BrowserRouter></AuthProvider>}
