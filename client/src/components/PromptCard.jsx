import { Link } from 'react-router-dom';
import { ArrowUpRight, Tag } from 'lucide-react';
export default function PromptCard({ prompt }) {
  return <Link to={`/prompts/${prompt._id}`} className="prompt-card">
    <div className="card-top"><span className="category-pill"><Tag size={12}/>{prompt.category}</span><ArrowUpRight size={18} className="card-arrow"/></div>
    <h3>{prompt.title}</h3><p>{prompt.description}</p>
    <div className="card-bottom"><span>By {prompt.author?.name || 'Community member'}</span><span>{new Date(prompt.createdAt).toLocaleDateString()}</span></div>
  </Link>;
}
