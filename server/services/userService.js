import db from '../db/dbConnection.js';
import bcrypt from 'bcrypt';

export const getUserByEmail = async (email) => {
  const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return user || null;
};

export async function getUserById(userId) {
  const sql = `
    SELECT u.id, u.full_name, u.email, u.phone, u.role, u.created_at, p.password_hash
    FROM users u
    JOIN passwords p ON u.id = p.user_id
    WHERE u.id = ?
  `;
  const [rows] = await db.execute(sql, [userId]);
  if (rows.length === 0) return null;
  return rows[0];
}

export const updateUserProfile = async (id, data) => {
  const { full_name, phone, email } = data;

  const [[{ count }]] = await db.query(
  'SELECT COUNT(*) as count FROM users WHERE email = ? AND id != ?',
  [email, id]
);
if (count > 0) throw new Error('Email already in use');


  const [result] = await db.query(
    'UPDATE users SET full_name = ?, phone = ?, email = ? WHERE id = ?',
    [full_name, phone, email, id]
  );
  return result.affectedRows > 0;
};

export const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) throw new Error('Current password incorrect');

  const newHash = await bcrypt.hash(newPassword, 10);
  return await updateUserPassword(userId, newHash);
};

export async function updateUserPassword(userId, newHash) {
  const sql = `UPDATE passwords SET password_hash = ? WHERE user_id = ?`;
  const [result] = await db.execute(sql, [newHash, userId]);
  return result.affectedRows === 1;
}

export const getUserWithOptionalSupplier = async (userId) => {
  const [users] = await db.query(
    "SELECT id, full_name, email, phone, role FROM users WHERE id = ?",
    [userId]
  );

  if (users.length === 0) {
    throw new Error("User not found");
  }

  const user = users[0];

  if (user.role === "supplier") {
    const [suppliers] = await db.query(
      "SELECT id FROM supplier_profiles WHERE user_id = ?",
      [userId]
    );

    if (suppliers.length > 0) {
      user.supplier_id = suppliers[0].id;
    }
  }

  return user;
};