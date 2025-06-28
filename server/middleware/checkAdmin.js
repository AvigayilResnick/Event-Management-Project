export const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

// בודק אם המשתמש הוא הבעלים או Admin
export function authorizeUserOrAdmin(getTargetId) {
  return (req, res, next) => {
    const paramId = getTargetId(req);
    if (req.user.role === 'admin' || req.user.id === paramId) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
}
// דוגמא לשימוש:
// app.get('/users/:id', authorizeUserOrAdmin(req => req.params.id), user