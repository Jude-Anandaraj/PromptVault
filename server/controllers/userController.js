// GET /api/users/profile (login required)
// The protect middleware has already loaded the logged-in user into req.user.
export function getProfile(req, res) {
  res.json({ user: req.user });
}
