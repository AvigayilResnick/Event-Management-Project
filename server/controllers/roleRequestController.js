import * as roleRequestService from '../services/roleRequestService.js';

export const requestRole = async (req, res) => {
  const userId = req.user.id;

  const { requested_role } = req.body;
  console.log('made it to the controller stage my user id:', userId);
  console.log('and my requested role:', requested_role)
  try {
    await roleRequestService.createRoleRequest(userId, requested_role);
    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await roleRequestService.getAllRequests();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const handleRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const validStatuses = ['approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    if (status === 'approved') {
      await roleRequestService.approveRoleRequestAndApplyRole(requestId);
    } else {
      const updated = await roleRequestService.rejectRoleRequest(requestId);
      if (!updated) return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: `Request ${status}` });
  } catch (err) {
    console.error('Error in handleRequest:', err.message);
    res.status(400).json({ message: err.message });
  }
};


export const getMyRoleRequestStatus = async (req, res) => {
  try {
    const status = await roleRequestService.getRoleRequestStatusService(req.user.id);
    res.json({ status }); // "pending", "approved", "rejected", or null
  } catch (err) {
    console.error("Error checking role status:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
