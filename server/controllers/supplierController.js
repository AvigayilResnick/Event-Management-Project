import {
  createSupplierBusiness,
  getAllMyBusinesses,
  getBusinessById,
  updateBusinessById,
  deleteBusinessById,
  deleteImageById
} from '../services/supplierService.js';

export const handleCreateSupplierBusiness = async (req, res) => {
  const userId = req.user.id;
  const images = req.files.map(file => `/uploads/${file.filename}`);

  try {
    const businessId = await createSupplierBusiness(userId, req.body, images);
    res.status(201).json({ message: 'Business created', businessId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create business' });
  }
};

export const handleGetAllMyBusinesses = async (req, res) => {
  try {
    const businesses = await getAllMyBusinesses(req.user.id);
    res.json(businesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch businesses' });
  }
};

export const handleGetBusinessById = async (req, res) => {
  const userId = req.user.id;
  const businessId = req.params.id;

  try {
    const business = await getBusinessById(userId, businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch business' });
  }
};

export const handleUpdateBusinessById = async (req, res) => {
  const userId = req.user.id;
  const businessId = req.params.id;
  const images = req.files?.length ? req.files.map(file => `/uploads/${file.filename}`) : null;

  try {
    await updateBusinessById(userId, businessId, req.body, images);
    res.json({ message: 'Business updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update business' });
  }
};

export const handleDeleteBusinessById = async (req, res) => {
  const userId = req.user.id;
  const businessId = req.params.id;

  try {
    await deleteBusinessById(userId, businessId);
    res.json({ message: 'Business deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete business' });
  }
};

export const handleDeleteImage = async (req, res) => {
  const userId = req.user.id;
  console.log("my ID:", userId )
  const imageId = req.params.imageId;

  try {
    const success = await deleteImageById(userId, imageId);
    if (success) {
      res.json({ message: 'Image deleted' });
    } else {
      res.status(404).json({ message: 'Image not found or not yours' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete image' });
  }
};