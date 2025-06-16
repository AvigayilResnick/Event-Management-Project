export const authorizeAdmin = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Forbidden - Admins only' });
};

export const authorizeUserOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

