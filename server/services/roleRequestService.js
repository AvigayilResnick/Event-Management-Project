import db from '../db/dbConnection.js';

export const createRoleRequest = async (userId, requested_role) => {
  console.log("so where did I get stock?");
  const [[existing]] = await db.query(
    'SELECT * FROM role_requests WHERE user_id = ? AND status = "pending"',
    [userId]
  );
  if (existing) throw new Error('You already have a pending request');

  await db.query(
    'INSERT INTO role_requests (user_id, requested_role) VALUES (?, ?)',
    [userId, requested_role]
  );
};
export const getAllRequests = async () => {
  const [requests] = await db.query(`
    SELECT rr.*, u.full_name, u.email, u.phone
    FROM role_requests rr
    JOIN users u ON rr.user_id = u.id
    WHERE u.role != 'supplier' -- רק מי שלא ספק
    ORDER BY rr.request_date DESC
  `);
  return requests;
};



// הכל בטרנזקציה אחת:
export const approveRoleRequestAndApplyRole = async (requestId) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1. עדכון סטטוס
    const [updateResult] = await conn.query(
      'UPDATE role_requests SET status = ? WHERE id = ?',
      ['approved', requestId]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('Request not found');
    }

    // 2. שליפת פרטי הבקשה המאושרת
    const [[request]] = await conn.query(
      'SELECT user_id, requested_role FROM role_requests WHERE id = ?',
      [requestId]
    );

    if (!request) {
      throw new Error('Failed to fetch request after update');
    }

    // 3. עדכון תפקיד המשתמש
    await conn.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [request.requested_role, request.user_id]
    );

    await conn.commit();
    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// פונקציה נפרדת רק לדחייה
export const rejectRoleRequest = async (requestId) => {
  const [result] = await db.query(
    `UPDATE role_requests 
     SET status = 'rejected' 
     WHERE id = ? AND status = 'pending'`,
    [requestId]
  );

  if (result.affectedRows === 0) {
    throw new Error('Request not found or already processed');
  }

  return true;
};



export const getUserRoleRequest = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM role_requests WHERE user_id = ? ORDER BY request_date DESC LIMIT 1",
    [userId]
  );
  return rows[0] || null;
};
export const getRoleRequestStatusService = async (userId) => {
  const [rows] = await db.query(`
    SELECT status 
    FROM role_requests 
    WHERE user_id = ? 
    ORDER BY request_date DESC 
    LIMIT 1
  `, [userId]);

  return rows.length ? rows[0].status : null;
};