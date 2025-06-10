import { signup, login } from '../services/authService.js';

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
    res.status(401).json({ message: err.message });
  }
};