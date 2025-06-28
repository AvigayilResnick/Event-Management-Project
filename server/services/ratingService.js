import db from '../db/dbConnection.js';

export const saveRating = async ({ userId, supplierId, rating }) => {
  await db.query(
    `INSERT INTO ratings (user_id, supplier_id, rating) VALUES (?, ?, ?)`,
    [userId, supplierId, rating]
  );
};

export const getSupplierRating = async (supplierId) => {
  const [[data]] = await db.query(`
    SELECT 
      ROUND(AVG(rating), 2) AS average,
      COUNT(*) AS total
    FROM ratings
    WHERE supplier_id = ?
  `, [supplierId]);

  return {
    average: data?.average || 0,
    total: data?.total || 0
  };
};

