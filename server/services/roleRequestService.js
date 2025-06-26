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

export const updateRequestStatus = async (requestId, status) => {
  const [result] = await db.query(
    'UPDATE role_requests SET status = ? WHERE id = ?',
    [status, requestId]
  );
  return result.affectedRows > 0;
};

export const applyRoleToUser = async (requestId) => {
  const [[request]] = await db.query(
    'SELECT user_id, requested_role FROM role_requests WHERE id = ? AND status = "approved"',
    [requestId]
  );
  if (!request) throw new Error('No approved request found');

  await db.query('UPDATE users SET role = ? WHERE id = ?', [
    request.requested_role,
    request.user_id
  ]);
};