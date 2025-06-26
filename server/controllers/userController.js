import * as userService from '../services/userService.js';

export const getMyProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { full_name, phone, email } = req.body;
    const updated = await userService.updateUserProfile(req.user.id, { full_name, phone, email });
    if (!updated) return res.status(404).json({ message: 'User not found or not updated' });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.message.includes('Email already in use')) {
      return res.status(400).json({ message: 'Email is already taken by another user' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing passwords' });
    }

    const success = await userService.changePasswordService(userId, currentPassword, newPassword);

    if (success) {
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ message: 'Password change failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
