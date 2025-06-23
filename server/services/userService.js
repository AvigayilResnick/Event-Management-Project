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

  return rows[0]; // מחזיר אובייקט עם כל השדות כולל password_hash
}

export const updateUserProfile = async (id, data) => {
  const { full_name, phone } = data;
  const [result] = await db.query(
    'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
    [full_name, phone, id]
  );
  return result.affectedRows > 0;
};

export const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await getUserById(userId);
  console.log('User from DB:', user);
  if (!user) throw new Error('User not found');
console.log('currentPassword:', currentPassword);
console.log('user.password_hash:', user.password_hash);

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) throw new Error('Current password incorrect');

  const newHash = await bcrypt.hash(newPassword, 10);

  const result = await updateUserPassword(userId, newHash);
  return result;
};
export async function updateUserPassword(userId, newHash) {
  const sql = `
    UPDATE passwords
    SET password_hash = ?
    WHERE user_id = ?
  `;
  const [result] = await db.execute(sql, [newHash, userId]);
  return result.affectedRows === 1;
}
