import db from '../db/dbConnection.js';

export const getUserByEmail = async (email) => {
  const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return user || null;
};

export const getUserById = async (id) => {
  const [[user]] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return user || null;
};

export const updateUserProfile = async (id, data) => {
  const { full_name, phone } = data;
  const [result] = await db.query(
    'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
    [full_name, phone, id]
  );
  return result.affectedRows > 0;
};

// פונקציות נוספות לניהול משתמשים
