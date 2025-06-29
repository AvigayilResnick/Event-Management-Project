import { signup, login } from '../services/authService.js';
import { getUserById } from '../services/userService.js';
import jwt from 'jsonwebtoken';
export const signupController = async (req, res) => {
  try {
    const { token, user } = await signup(req.body);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await login(email, password);
    res.json({ token, user });
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ message: err.message });
  }
};
export const refreshToken = async (req, res) => {
  const user = await getUserById(req.user.id); // שליפה עדכנית מה-DB
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token });
};
