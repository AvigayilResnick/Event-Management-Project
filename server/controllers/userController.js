import * as userService from '../services/userService.js';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { full_name, phone } = req.body;

    const updated = await userService.updateUserProfile(userId, { full_name, phone });
    if (!updated) return res.status(404).json({ message: 'User not found or not updated' });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};      
