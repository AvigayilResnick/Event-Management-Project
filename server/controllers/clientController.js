// controllers/clientController.js
import * as clientService from '../services/clientService.js';

// קבלת ספקים לדף הבית
export async function getSuppliers(req, res) {
  try {
    const {
      eventName = null,
      city = null,
      priceMin = null,
      priceMax = null,
      search = null,
      sortBy = 'price_min',
      sortOrder = 'asc',
      limit = 20,
      offset = 0
    } = req.query;

    const suppliers = await clientService.getSuppliersForHome({
      eventName,
      city,
      priceMin: priceMin !== null ? parseInt(priceMin) : null,
      priceMax: priceMax !== null ? parseInt(priceMax) : null,
      search,
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


// קבלת פרטי ספק לפי מזהה
export async function getSupplierDetails(req, res) {
  try {
    const supplierId = req.params.id;
    const supplier = await clientService.getSupplierDetails(supplierId);

    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier details:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function sendContactMessage(req, res) {
  try {
    const fromUserId = req.user.id;
    const { supplierId, messageText } = req.body;

    if (!supplierId || !messageText) {
      return res.status(400).json({ message: 'Missing supplierId or messageText' });
    }

    const result = await clientService.sendContactMessage({ fromUserId, supplierId, messageText });
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
}
// קבלת פרטי ספק מלאים כולל תמונות ואירועים
export async function getSupplierFullDetails(req, res) {
  try {
    const supplierId = req.params.id;
    const supplier = await clientService.getSupplierDetails(supplierId);

    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    console.error('Error fetching full supplier details:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function requestSupplier(req, res) {
  try {
    const userId = req.user.id;

    const result = await clientService.requestSupplier(userId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    console.error('Error in requestSupplier:', err);
    res.status(500).json({ message: 'Server error' });
  }
}