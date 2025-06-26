import db from '../db.js';

export const addRating = async (userId, supplierId, rating) => {
  const [existing] = await db.query(
    'SELECT id FROM ratings WHERE user_id = ? AND supplier_id = ?',
    [userId, supplierId]
  );

  if (existing.length > 0) {
    throw new Error("You already rated this supplier.");
  }

  await db.query(
    'INSERT INTO ratings (user_id, supplier_id, rating) VALUES (?, ?, ?)',
    [userId, supplierId, rating]
  );
};

export const getSupplierRating = async (supplierId) => {
  const [rows] = await db.query(
    'SELECT AVG(rating) as average, COUNT(*) as total FROM ratings WHERE supplier_id = ?',
    [supplierId]
  );

  return rows[0]; // { average: ..., total: ... }
};
