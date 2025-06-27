import db from '../db.js';

export const addRating = async (userId, supplierId, rating) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query(
      'SELECT id FROM ratings WHERE user_id = ? AND supplier_id = ?',
      [userId, supplierId]
    );

    if (existing.length > 0) {
      throw new Error("You already rated this supplier.");
    }

    await conn.query(
      'INSERT INTO ratings (user_id, supplier_id, rating) VALUES (?, ?, ?)',
      [userId, supplierId, rating]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getSupplierRating = async (supplierId) => {
  const [rows] = await db.query(
    'SELECT AVG(rating) as average, COUNT(*) as total FROM ratings WHERE supplier_id = ?',
    [supplierId]
  );
  return rows[0];
};
