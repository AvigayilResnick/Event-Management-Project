export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

// פונקציה לבדיקה אם המשתמש הוא הבעלים או admin
export function authorizeUserOrAdmin(getTargetId) {
  return (req, res, next) => {
    const targetId = Number(getTargetId(req));
    if (req.user.role === 'admin' || req.user.id === targetId) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
}