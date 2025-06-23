import db from '../db/dbConnection.js';
import { sendEmail } from './emailService.js';

export async function createMessage({ fromUserId, toUserId, messageText }) {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // שליפת אימייל השולח
    const [fromRows] = await conn.query('SELECT email, full_name FROM users WHERE id = ?', [fromUserId]);
    if (fromRows.length === 0) {
      throw new Error('Sender not found');
    }
    const senderEmail = fromRows[0].email;
    const senderName = fromRows[0].full_name;

    // שליפת אימייל הנמען
    const [toRows] = await conn.query('SELECT email FROM users WHERE id = ?', [toUserId]);
    if (toRows.length === 0) {
      throw new Error('Recipient not found');
    }
    const recipientEmail = toRows[0].email;


    const [result] = await conn.query(
      'INSERT INTO messages (from_user_id, to_user_id, message_text) VALUES (?, ?, ?)',
      [fromUserId, toUserId, messageText]
    );
    const messageId = result.insertId;

   
    
    await sendEmail({
      to: recipientEmail,
      subject: `New message from ${senderName}`,
      text: `${messageText}\n\nReply to: ${senderEmail}`,
      html: `
        <p>${messageText}</p>
        <p>Reply to: <a href="mailto:${senderEmail}">${senderEmail}</a></p>
      `,
      replyTo: senderEmail,  
    });

    //the message was sent successfully, update the database

    await conn.query('UPDATE messages SET email_sent = TRUE WHERE id = ?', [messageId]);

    await conn.commit();
    return messageId;

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
