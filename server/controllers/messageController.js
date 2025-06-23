import { createMessage } from '../services/messageService.js';

export async function postMessage(req, res) {
  try {
    const fromUserId = req.user.id; 
    const { toUserId, messageText } = req.body;

    if (!toUserId || !messageText) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const messageId = await createMessage({ fromUserId, toUserId, messageText });
    res.status(201).json({ message: 'Message sent and saved', id: messageId });
  } catch (error) {
    console.error('postMessage error:', error);
    res.status(500).json({ message: error.message });
  }
}
