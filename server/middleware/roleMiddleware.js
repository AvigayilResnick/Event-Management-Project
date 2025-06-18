export const authorizeAdmin = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Forbidden - Admins only' });
};

export const authorizeUserOrAdmin = (req, res, next) => {
  const paramId = Number(req.params.id);
  if (req.user.role === 'admin' || req.user.id === paramId) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};

export const authorizeUser = (req, res, next) => {
  const paramId = Number(req.params.id);
  if ( req.user.id === paramId) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};

export const authorizeClientOnly = (req, res, next) => {
  if (req.user.role === 'client') return next();
  return res.status(403).json({ message: 'Only clients can request to become suppliers' });
};