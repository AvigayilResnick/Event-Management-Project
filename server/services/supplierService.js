import db from '../db/dbConnection.js';

export const createSupplierBusiness = async (userId, data, images) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      business_name,
      category,
      description,
      price_min,
      price_max,
      city,
      event_types
    } = data;

    const parsedEvents = typeof event_types === 'string' ? JSON.parse(event_types) : event_types;

    const [profileResult] = await conn.query(
      `INSERT INTO supplier_profiles 
       (user_id, business_name, category, description, price_min, price_max, city) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, business_name, category, description, price_min, price_max, city]
    );

    const businessId = profileResult.insertId;

    for (const eventName of parsedEvents) {
      const [[existingEvent]] = await conn.query('SELECT id FROM events WHERE name = ?', [eventName]);
      const eventId = existingEvent ? existingEvent.id : (await conn.query(
        'INSERT INTO events (name) VALUES (?)', [eventName]
      ))[0].insertId;

      await conn.query(
        'INSERT INTO supplier_event_types (supplier_id, event_id) VALUES (?, ?)',
        [businessId, eventId]
      );
    }

    for (const imageUrl of images) {
      await conn.query(
        'INSERT INTO images (supplier_id, image_url) VALUES (?, ?)',
        [businessId, imageUrl]
      );
    }

    await conn.commit();
    return businessId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getAllMyBusinesses = async (userId) => {
  const [profiles] = await db.query(`SELECT * FROM supplier_profiles WHERE user_id = ?`, [userId]);
  const supplierIds = profiles.map(p => p.id);

  const [events] = supplierIds.length > 0
    ? await db.query(`
        SELECT s.supplier_id, e.name 
        FROM supplier_event_types s 
        JOIN events e ON s.event_id = e.id 
        WHERE s.supplier_id IN (?)`, [supplierIds])
    : [[]];

  const [images] = supplierIds.length > 0
    ? await db.query(`SELECT id, supplier_id, image_url FROM images WHERE supplier_id IN (?)`, [supplierIds])
    : [[]];

  for (const profile of profiles) {
    profile.event_types = events.filter(e => e.supplier_id === profile.id).map(e => e.name);
    profile.images = images.filter(i => i.supplier_id === profile.id).map(i => ({ id: i.id, url: i.image_url }));
  }

  return profiles;
};


export const getBusinessById = async (userId, businessId) => {
  const [[profile]] = await db.query(`SELECT * FROM supplier_profiles WHERE id = ? AND user_id = ?`, [businessId, userId]);
  if (!profile) return null;

  const [events] = await db.query(`SELECT e.name FROM supplier_event_types s JOIN events e ON s.event_id = e.id WHERE s.supplier_id = ?`, [businessId]);
  const [images] = await db.query(`SELECT id, image_url FROM images WHERE supplier_id = ?`, [businessId]);

  return {
    ...profile,
    event_types: events.map(e => e.name),
    images: images.map(img => ({ id: img.id, url: img.image_url }))
  };
};

export const updateBusinessById = async (userId, businessId, data, newImages = null) => {
  const [[profile]] = await db.query(`SELECT * FROM supplier_profiles WHERE id = ? AND user_id = ?`, [businessId, userId]);
  if (!profile) throw new Error('Business not found or not yours');

  const fields = [];
  const values = [];
  const fieldMap = {
    business_name: 'business_name',
    category: 'category',
    description: 'description',
    price_min: 'price_min',
    price_max: 'price_max',
    city: 'city'
  };

  for (const key in fieldMap) {
    if (key in data) {
      fields.push(`${fieldMap[key]} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length > 0) {
    await db.query(`UPDATE supplier_profiles SET ${fields.join(', ')} WHERE id = ?`, [...values, businessId]);
  }

  if (data.event_types) {
    const parsedEvents = typeof data.event_types === 'string' ? JSON.parse(data.event_types) : data.event_types;
    await db.query(`DELETE FROM supplier_event_types WHERE supplier_id = ?`, [businessId]);

    for (const eventName of parsedEvents) {
      const [[existingEvent]] = await db.query('SELECT id FROM events WHERE name = ?', [eventName]);
      const eventId = existingEvent ? existingEvent.id : (await db.query('INSERT INTO events (name) VALUES (?)', [eventName]))[0].insertId;
      await db.query('INSERT INTO supplier_event_types (supplier_id, event_id) VALUES (?, ?)', [businessId, eventId]);
    }
  }

  if (newImages && newImages.length > 0) {
    for (const imageUrl of newImages) {
      await db.query('INSERT INTO images (supplier_id, image_url) VALUES (?, ?)', [businessId, imageUrl]);
    }
  }

  return businessId;
};

export const deleteBusinessById = async (userId, businessId) => {
  const [[profile]] = await db.query(`SELECT id FROM supplier_profiles WHERE id = ? AND user_id = ?`, [businessId, userId]);
  if (!profile) throw new Error('Business not found or not yours');

  await db.query('DELETE FROM images WHERE supplier_id = ?', [businessId]);
  await db.query('DELETE FROM supplier_event_types WHERE supplier_id = ?', [businessId]);
  await db.query('DELETE FROM supplier_profiles WHERE id = ?', [businessId]);

  return true;
};

export const deleteImageById = async (userId, imageId) => {
  // נוודא שהתמונה באמת שייכת לאחד העסקים של המשתמש
  const [[image]] = await db.query(
    `SELECT supplier_id FROM images WHERE id = ?`,
    [imageId]
  );

  if (!image) throw new Error('Image not found');

  const [[ownsBusiness]] = await db.query(
    `SELECT id FROM supplier_profiles WHERE id = ? AND user_id = ?`,
    [image.supplier_id, userId]
  );

  if (!ownsBusiness) throw new Error('Not authorized to delete this image');

  const [result] = await db.query(
    `DELETE FROM images WHERE id = ?`,
    [imageId]
  );

  return result.affectedRows > 0;
};