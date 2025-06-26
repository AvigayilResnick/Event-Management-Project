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
export const changePasswordController = async (req, res) => {
  try {
    const userId = req.user.id; // מ־middleware האותנטיקציה
    const { currentPassword, newPassword } = req.body;
 console.log('userId:', userId, 'currentPassword:', currentPassword, 'newPassword:', newPassword);
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

export const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserWithOptionalSupplier(userId);
    res.json(user);
  } catch (err) {
    console.error("❌ Error in getMyInfo:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
};