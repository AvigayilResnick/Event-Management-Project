// services/clientService.js

import db from '../db/dbConnection.js';
import nodemailer from 'nodemailer';
// Get suppliers filtered by search criteria (optional)
export async function getSuppliersForHome({
  eventName = null,
  limit = 20,
  offset = 0
}) {
  const params = [];
  let query = `
    SELECT sp.id, sp.business_name,
           LEFT(sp.description, 120) AS short_description
    FROM supplier_profiles sp
    JOIN supplier_event_types setp ON sp.id = setp.supplier_id
    JOIN events e ON e.id = setp.event_id
    WHERE 1 = 1
  `;

  // סינון לפי סוג אירוע אם קיים
  if (eventName) {
    query += ' AND e.name = ?';
    params.push(eventName);
  }

  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [suppliers] = await db.query(query, params);
  return suppliers;
}

async function getSupplierBasicInfo(supplierId) {
  const [[supplier]] = await db.query(
    `SELECT sp.*, u.full_name, u.email
     FROM supplier_profiles sp
     JOIN users u ON sp.user_id = u.id
     WHERE sp.id = ?`,
    [supplierId]
  );
  return supplier || null;
}

async function getSupplierImages(supplierId) {
  const [images] = await db.query(
    `SELECT image_url FROM images WHERE supplier_id = ?`,
    [supplierId]
  );
  return images.map(img => img.image_url);
}

async function getSupplierEvents(supplierId) {
  const [events] = await db.query(
    `SELECT e.name FROM events e
     JOIN supplier_event_types setp ON e.id = setp.event_id
     WHERE setp.supplier_id = ?`,
    [supplierId]
  );
  return events.map(ev => ev.name);
}

// פונקציה ראשית שמשלבת את כולם
async function getSupplierDetails(supplierId) {
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

// const transporter = nodemailer.createTransport({
//   host: 'smtp.example.com',   // למשל smtp.gmail.com
//   port: 587,
//   secure: false,              // true אם משתמשים ב-465
//   auth: {
//     user: 'your_email@example.com',
//     pass: 'your_email_password',
//   },
// });

// פונקציה לשליפת מייל של משתמש לפי id
// async function getUserEmailById(userId) {
//   const [[user]] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
//   if (!user) throw new Error(`User with id ${userId} not found`);
//   return user.email;
// }

// פונקציה לשמירת הודעה במסד (לוג)
// async function saveMessageToDB(fromUserId, toUserId, messageText) {
//   return db.query(
//     'INSERT INTO messages (from_user_id, to_user_id, message_text) VALUES (?, ?, ?)',
//     [fromUserId, toUserId, messageText]
//   );
// }

// // פונקציה לשליחת מייל צור קשר
// export async function sendContactMessage(fromUserId, toUserId, messageText) {
//   try {
//     // שליפת מיילים
//     const fromEmail = await getUserEmailById(fromUserId);
//     const toEmail = await getUserEmailById(toUserId);

//     // שמירת ההודעה במסד
//     await saveMessageToDB(fromUserId, toUserId, messageText);

//     // בניית מייל
//     const mailOptions = {
//       from: '"Event Manager" <your_email@example.com>',  // כתובת של האתר
//       to: toEmail,                                      // הספק
//       replyTo: fromEmail,                               // כתובת הלקוח
//       subject: 'פנייה חדשה מלקוח באתר ניהול האירועים',
//       text: messageText,
//     };

//     // שליחת המייל
//     const info = await transporter.sendMail(mailOptions);

//     console.log('Email sent: ' + info.messageId);

//     return { success: true, message: 'ההודעה נשלחה בהצלחה' };
//   } catch (error) {
//     console.error('Error in sendContactMessage:', error);
//     return { success: false, message: 'שגיאה בשליחת ההודעה', error: error.message };
//   }
// }
