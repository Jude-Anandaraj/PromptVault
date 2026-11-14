const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const TOKEN_KEY = 'promptvault_token';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

// The server sends errors as { error: "..." }.
// Validation errors also have details: { field: "message" }, which are more specific.
function errorMessage(data, status) {
  if (data.details) return Object.values(data.details).join(' ');
  return data.error || `Request failed (${status}). Please try again.`;
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try { response = await fetch(`${API_URL}${path}`, { ...options, headers }); }
  catch { throw new Error('Unable to reach PromptVault. Check your connection and try again.'); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(errorMessage(data, response.status));
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  // Accounts
  register: body => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: body => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  profile: () => request('/users/profile'),

  // Prompts and categories
  prompts: (q = '', category = 'All') => request(`/prompts?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`),
  categories: () => request('/categories'),
  prompt: id => request(`/prompts/${id}`),
  createPrompt: body => request('/prompts', { method: 'POST', body: JSON.stringify(body) }),
  updatePrompt: (id, body) => request(`/prompts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePrompt: id => request(`/prompts/${id}`, { method: 'DELETE' })
};
