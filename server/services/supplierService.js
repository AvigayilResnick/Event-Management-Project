import db from '../db/dbConnection'

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