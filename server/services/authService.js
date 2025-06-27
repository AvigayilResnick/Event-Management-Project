import db from '../db/dbConnection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async ({ full_name, email, phone, password, role = 'client' }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

const [[{ count }]] = await conn.query('SELECT COUNT(*) as count FROM users WHERE email = ?', [email]);
if (count > 0) throw new Error('Email already in use');


    const [result] = await conn.query(
      'INSERT INTO users (full_name, email, phone, role) VALUES (?, ?, ?, ?)',
      [full_name, email, phone, role]
    );
    const userId = result.insertId;

    const hashedPassword = await bcrypt.hash(password, 10);
    await conn.query(
      'INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)',
      [userId, hashedPassword]
    );

    await conn.commit();

    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    return {
      token,
      user: { full_name, email, phone, role }
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const login = async (email, password) => {
  const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) throw new Error('User not found');

  const [[passRecord]] = await db.query('SELECT * FROM passwords WHERE user_id = ?', [user.id]);
  const isMatch = await bcrypt.compare(password, passRecord.password_hash);
  if (!isMatch) throw new Error('Invalid password');

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });

  const { full_name, email: userEmail, phone, role } = user;
  return {
    token,
    user: { full_name, email: userEmail, phone, role }
  };
};
