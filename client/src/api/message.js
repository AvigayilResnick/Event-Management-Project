import apiClient from "./apiClient";

export const sendMessage = async ({ fromUserId, toUserId, messageText }) => {
  const response = await apiClient.post("/messages/send-message", {
    fromUserId,
    toUserId,
    messageText,
  });
  return response.data; // { message: "...", id: 123 }
};
