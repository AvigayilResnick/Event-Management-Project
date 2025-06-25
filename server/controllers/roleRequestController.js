import {
  createRoleRequest,
  getAllRequests,
  updateRequestStatus,
  applyRoleToUser
} from '../services/roleRequestService.js';

export const requestRole = async (req, res) => {
  const userId = req.user.id;

  const { requested_role } = req.body;
  console.log('made it to the controller stage my user id:', userId);
  console.log('and my requested role:', requested_role)
  try {
    await createRoleRequest(userId, requested_role);
    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await getAllRequests();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    const updated = await updateRequestStatus(requestId, status);
    if (!updated) return res.status(404).json({ message: 'Request not found' });

    if (status === 'approved') {
      await applyRoleToUser(requestId);
    }

    res.json({ message: `Request ${status}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};