// services/clientService.js

import db from '../db/dbConnection.js';
import nodemailer from 'nodemailer';
// Get suppliers filtered by search criteria (optional)
export async function getSuppliersForHome({
  eventName = null,
  category = null,
  city = null,
  priceMin = null,
  priceMax = null,
  search = null,
  sortBy = 'price_min',
  sortOrder = 'asc',
  limit = 20,
  offset = 0
}) {
  const params = [];
  let query = `
    SELECT sp.id, sp.business_name,
           LEFT(sp.description, 120) AS short_description
    FROM supplier_profiles sp
  `;

  // ✳️ צור JOIN רק אם יש eventName
  if (eventName) {
    query += `
      JOIN supplier_event_types setp ON sp.id = setp.supplier_id
      JOIN events e ON e.id = setp.event_id
    `;
  }

  query += ` WHERE 1=1 `;

  if (eventName) {
    query += ` AND e.name = ? `;
    params.push(eventName);
  }

  if (category) {
    query += ` AND sp.category = ? `;
    params.push(category);
  }

  if (city) {
    query += ` AND sp.city = ? `;
    params.push(city);
  }

  if (
    typeof priceMin === "number" &&
    typeof priceMax === "number" &&
    !isNaN(priceMin) &&
    !isNaN(priceMax)
  ) {
    query += ` AND sp.price_max >= ? AND sp.price_min <= ? `;
    params.push(priceMin, priceMax);
  }

  if (search) {
    query += ` AND (sp.business_name LIKE ? OR sp.description LIKE ?) `;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` GROUP BY sp.id `;

  if (sortBy === 'average_price') {
    query += ` ORDER BY (sp.price_min + sp.price_max) / 2 ${sortOrder.toUpperCase()} `;
  } else {
    query += ` ORDER BY sp.${sortBy} ${sortOrder.toUpperCase()} `;
  }

  query += ` LIMIT ? OFFSET ? `;
  params.push(limit, offset);

 

  const [rows] = await db.query(query, params);
  return rows;
}






export async function getAllEvents() {
const [events] = await db.query('SELECT DISTINCT name FROM events ORDER BY name ASC');
return events.map(e => e.name);

}

export async function getSupplierBasicInfo(supplierId) {
  const [[supplier]] = await db.query(
    `SELECT sp.*, u.full_name, u.email
     FROM supplier_profiles sp
     JOIN users u ON sp.user_id = u.id
     WHERE sp.id = ?`,
    [supplierId]
  );
  return supplier || null;
}

export async function getSupplierImages(supplierId) {
  const [images] = await db.query(
    `SELECT image_url FROM images WHERE supplier_id = ?`,
    [supplierId]
  );
  return images.map(img => img.image_url);
}

export async function getSupplierEvents(supplierId) {
  const [events] = await db.query(
    `SELECT e.name FROM events e
     JOIN supplier_event_types setp ON e.id = setp.event_id
     WHERE setp.supplier_id = ?`,
    [supplierId]
  );
  return events.map(ev => ev.name);
}

// פונקציה ראשית שמשלבת את כולם
export async function getSupplierDetails(supplierId) {
  const supplier = await getSupplierBasicInfo(supplierId);
  if (!supplier) return null;

  const images = await getSupplierImages(supplierId);
  const events = await getSupplierEvents(supplierId);

  return {
    ...supplier,
    images,
    events,
  };
}

export async function requestSupplier(userId) {
  // 1. בדיקה אם הוא כבר ספק
  const [[user]] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
  if (!user) return { success: false, message: 'User not found' };
  if (user.role === 'supplier') {
    return { success: false, message: 'You are already a supplier' };
  }

  // 2. בדיקה אם יש בקשה קיימת
  const [[existingRequest]] = await db.query(
    'SELECT * FROM supplier_requests WHERE user_id = ? AND status = "pending"',
    [userId]
  );
  if (existingRequest) {
    return { success: false, message: 'You already submitted a request' };
  }

  // 3. יצירת בקשה חדשה
  await db.query(
    'INSERT INTO supplier_requests (user_id) VALUES (?)',
    [userId]
  );

  return { success: true };
}



export async function getAllCategories() {
  const [rows] = await db.query(`
    SELECT DISTINCT category
    FROM supplier_categories
    ORDER BY category
  `);
  return rows;
}

