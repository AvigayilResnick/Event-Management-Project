import * as ratingService from '../services/ratingService.js';

export const submitRating = async (req, res) => {
  const userId = req.user.id; // לוקחים מהטוקן
  const { supplierId, rating } = req.body;

  try {
    await ratingService.saveRating({ userId, supplierId, rating });
    res.status(201).json({ message: "Rating submitted" });
  } catch (err) {
    if (err.message.includes("duplicate")) {
      res.status(400).json({ message: "You already rated this supplier." });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

export const getRatingStats = async (req, res) => {
  const supplierId = req.params.supplierId;
  try {
    const data = await ratingService.getSupplierRating(supplierId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
