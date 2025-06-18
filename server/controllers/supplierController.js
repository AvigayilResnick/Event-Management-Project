import { createSupplierProfile } from '../services/supplierService.js';

export const handleCreateSupplier = async (req, res) => {
  const userId = req.user.id;
  const images = req.files.map(file => `/uploads/${file.filename}`); // שמירה עם הנתיב היחסי

  try {
    const profileId = await createSupplierProfile(userId, req.body, images);
    res.status(201).json({ message: 'Supplier profile created', profileId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create supplier profile' });
  }
};