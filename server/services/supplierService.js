import db from '../db/dbConnection.js'

export const createSupplierProfile = async (userId, data, images) => {
  const {
    business_name,
    category,
    description,
    price_min,
    price_max,
    city,
    event_types // נניח שמגיע כ-JSON string או מערך
  } = data;

  console.log('events:', data);
  const parsedEvents = typeof event_types === 'string' ? JSON.parse(event_types) : event_types;

  const [profileResult] = await db.query(
    `INSERT INTO supplier_profiles 
    (user_id, business_name, category, description, price_min, price_max, city) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, business_name, category, description, price_min, price_max, city]
  );

  const supplierId = profileResult.insertId;

  for (const eventName of parsedEvents) {
    const [[existingEvent]] = await db.query(
      'SELECT id FROM events WHERE name = ?',
      [eventName]
    );

    let eventId;
    if (existingEvent) {
      eventId = existingEvent.id;
    } else {
      const [eventResult] = await db.query(
        'INSERT INTO events (name) VALUES (?)',
        [eventName]
      );
      eventId = eventResult.insertId;
    }

    await db.query(
      'INSERT INTO supplier_event_types (supplier_id, event_id) VALUES (?, ?)',
      [supplierId, eventId]
    );
  }

  for (const imageUrl of images) {
    await db.query(
      'INSERT INTO images (supplier_id, image_url) VALUES (?, ?)',
      [supplierId, imageUrl]
    );
  }

  return supplierId;
};

export const getMySupplierProfile = async (userId) => {
  const [[profile]] = await db.query(
    `SELECT * FROM supplier_profiles WHERE user_id = ?`,
    [userId]
  );

  if (!profile) return null;

  // שליפת סוגי אירועים
  const [events] = await db.query(
    `SELECT e.name FROM supplier_event_types s
     JOIN events e ON s.event_id = e.id
     WHERE s.supplier_id = ?`,
    [profile.id]
  );

  // שליפת תמונות
  const [images] = await db.query(
    `SELECT id, image_url FROM images WHERE supplier_id = ?`,
    [profile.id]
  );

  return {
    ...profile,
    event_types: events.map(e => e.name),
    images: images.map(img => img.image_url)
  };
};