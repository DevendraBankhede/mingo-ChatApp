import Message from "../models/messageModel.js";

// Upload document endpoint
export const UploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.statusCode = 400;
      return next(error);
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileData = {
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    };

    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      data: fileData,
    });
  } catch (error) {
    console.error("UploadDocument error:", error);
    next(error);
  }
};

export const SendMessage = async (req, res, next) => {
  try {
    const {
      receiverID,
      message = "",
      messageType = "text",
      fileUrl = "",
      fileName = "",
      fileSize = 0,
      fileType = "",
    } = req.body;
    const currentUser = req.user;

    console.log("Receiver ID:", receiverID);
    console.log("Message:", message);
    console.log("File URL:", fileUrl);

    if (!receiverID || (!message.trim() && !fileUrl)) {
      const error = new Error("Message text or document is required");
      error.statusCode = 400;
      return next(error);
    }

    const computedMessageType =
      messageType || (fileUrl ? "document" : "text");

    const newMessage = await Message.create({
      senderId: currentUser._id,
      receiverId: receiverID,
      message: message.trim(),
      messageType: computedMessageType,
      fileUrl,
      fileName,
      fileSize,
      fileType,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("SendMessage error:", error);
    next(error);
  }
};

export const GetMessages = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const currentUser = req.user;

    const messages = await Message.find({
      $or: [
        { senderId: currentUser._id, receiverId: friendId },
        { senderId: friendId, receiverId: currentUser._id },
      ],
    })
      .sort({ createdAt: 1 })
      .select("-__v");

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("GetMessages error:", error);
    next(error);
  }
};