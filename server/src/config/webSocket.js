import Message from "../models/messageModel.js";

// Multi-socket user presence tracking
// userSockets: userId (string) -> Set of socketId strings
const userSockets = new Map();
// socketToUser: socketId -> userId (string)
const socketToUser = new Map();

const getOnlineUsersMap = () => {
  const onlineObj = {};
  for (const [userId, sockets] of userSockets.entries()) {
    if (sockets && sockets.size > 0) {
      // First socket ID for backwards compatibility, and boolean true indicator
      onlineObj[userId] = Array.from(sockets)[0] || true;
    }
  }
  return onlineObj;
};

const WebSocket = (io) => {
  console.log("🔌 Socket.IO Initialized");

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    // Send current online users map immediately to the newly connected socket
    socket.emit("onlineUsers", getOnlineUsersMap());

    const handleUserOnline = (userID) => {
      if (!userID) return;
      const idStr = String(userID);

      if (!userSockets.has(idStr)) {
        userSockets.set(idStr, new Set());
      }
      userSockets.get(idStr).add(socket.id);
      socketToUser.set(socket.id, idStr);

      console.log(`👤 User Online: ${idStr} (socket: ${socket.id})`);
      console.log("🟢 Active Online Users:", Array.from(userSockets.keys()));

      io.emit("onlineUsers", getOnlineUsersMap());
    };

    const handleUserOffline = (userID) => {
      if (!userID) return;
      const idStr = String(userID);

      if (userSockets.has(idStr)) {
        userSockets.get(idStr).delete(socket.id);
        if (userSockets.get(idStr).size === 0) {
          userSockets.delete(idStr);
        }
      }
      socketToUser.delete(socket.id);

      console.log(`👤 User Offline: ${idStr}`);
      console.log("🟢 Active Online Users:", Array.from(userSockets.keys()));

      io.emit("onlineUsers", getOnlineUsersMap());
    };

    // User online registration events (supporting both names)
    socket.on("OmBhramyaNamah", handleUserOnline);
    socket.on("userOnline", handleUserOnline);

    // User explicit offline events
    socket.on("OmNamahShivay", handleUserOffline);
    socket.on("userOffline", handleUserOffline);

    // Explicit request to get online users
    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsers", getOnlineUsersMap());
    });

    // Handle Disconnect
    socket.on("disconnect", (reason) => {
      const userId = socketToUser.get(socket.id);
      if (userId) {
        if (userSockets.has(userId)) {
          userSockets.get(userId).delete(socket.id);
          if (userSockets.get(userId).size === 0) {
            userSockets.delete(userId);
            console.log(`🔴 User marked offline after all sockets closed: ${userId}`);
          }
        }
        socketToUser.delete(socket.id);
        io.emit("onlineUsers", getOnlineUsersMap());
      }
      console.log(`🔌 Client disconnected: ${socket.id} (Reason: ${reason})`);
    });

    // Handle sending chat messages / documents
    socket.on("send", async (payload) => {
      try {
        console.log("Message Pack received:", payload);

        if (
          !payload?.senderID ||
          !payload?.receiverID ||
          (!payload?.message?.trim() && !payload?.fileUrl)
        ) {
          return;
        }

        const newMessage = await Message.create({
          senderId: payload.senderID,
          receiverId: payload.receiverID,
          message: payload.message?.trim() || "",
          messageType: payload.messageType || (payload.fileUrl ? "document" : "text"),
          fileUrl: payload.fileUrl || "",
          fileName: payload.fileName || "",
          fileSize: payload.fileSize || 0,
          fileType: payload.fileType || "",
        });

        console.log("Message Saved to DB:", newMessage._id);

        const newMessagePack = newMessage.toObject();
        delete newMessagePack.__v;

        const receiverIdStr = String(payload.receiverID);
        const receiverSockets = userSockets.get(receiverIdStr);

        if (receiverSockets && receiverSockets.size > 0) {
          console.log(`Delivering message to receiver ${receiverIdStr} on ${receiverSockets.size} socket(s)`);
          for (const socketId of receiverSockets) {
            io.to(socketId).emit("receive", newMessagePack);
          }
        }
      } catch (error) {
        console.error("Error handling socket send message:", error);
      }
    });
  });
};

export default WebSocket;