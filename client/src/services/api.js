const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export function getToken() { return localStorage.getItem('promptvault_token'); }
async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try { response = await fetch(`${API_URL}${path}`, { ...options, headers }); }
  catch { throw new Error('Unable to reach PromptVault. Check your connection and try again.'); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status}). Please try again.`);
    error.status = response.status;
    throw error;
  }
  return data;
}
export const api = {
  register: body => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: body => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  prompts: (q = '', category = 'All') => request(`/prompts?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`),
  categories: () => request('/categories'),
  prompt: id => request(`/prompts/${id}`),
  createPrompt: body => request('/prompts', { method: 'POST', body: JSON.stringify(body) }),
  updatePrompt: (id, body) => request(`/prompts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePrompt: id => request(`/prompts/${id}`, { method: 'DELETE' })
};
