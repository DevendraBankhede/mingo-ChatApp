import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../config/api";
import socketAPI from "../../config/webSocket";
import toast from "react-hot-toast";

const Chatting = ({ selectedFriend, currentUser, isOnline, onBack }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const [filteredChatData, setFilteredChatData] = useState([]);
  const [receiver, setReceiver] = useState(selectedFriend);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Document attachment state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Lightbox / Full Image Viewer state
  const [activeImage, setActiveImage] = useState(null); // { url, fileName, fileSize, senderName, time }
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleProfileClick = () => {
    if (location.pathname === "/settings" || location.pathname === "/dashboard") {
      navigate("/chat");
    } else {
      navigate("/settings");
    }
  };

  const scrollToBottom = (behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [selectedFriend]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [filteredChatData]);

  const fetchChatData = async () => {
    if (!selectedFriend?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/user/get-messages/${selectedFriend._id}`);
      setFilteredChatData(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch chat data", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes) || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Helper to get backend base URL for downloads and image previews
  const getFullFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("data:") || url.startsWith("blob:")) return url;
    const rawBaseUrl =
      import.meta.env.VITE_BACKEND_URL ||
      (typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:4500"
        : "https://mingo-chatapp.onrender.com");
    const serverOrigin = rawBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    return `${serverOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Helper to get document info and styling
  const getDocTypeInfo = (fileName = "", fileType = "", fileUrl = "", messageType = "") => {
    const rawExt = (fileName.split(".").pop() || "").toLowerCase();
    const urlExt = (String(fileUrl).split("?")[0].split(".").pop() || "").toLowerCase();
    const ext = rawExt || urlExt;

    const isImg =
      ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif", "tiff"].includes(ext) ||
      fileType?.startsWith("image/") ||
      fileType === "image" ||
      messageType === "image" ||
      (typeof fileUrl === "string" && (fileUrl.startsWith("data:image/") || fileUrl.includes("/uploads/")));

    if (isImg) {
      return {
        label: "Image",
        ext: (ext || "IMG").toUpperCase(),
        icon: "🖼️",
        isImage: true,
        colorClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        badgeClass: "badge-secondary",
      };
    }

    if (["pdf"].includes(ext) || fileType.includes("pdf")) {
      return {
        label: "PDF",
        ext: "PDF",
        icon: "📄",
        colorClass: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
        badgeClass: "badge-error",
      };
    }
    if (["doc", "docx", "rtf", "odt"].includes(ext) || fileType.includes("word") || fileType.includes("document")) {
      return {
        label: "Word Document",
        ext: ext.toUpperCase() || "DOC",
        icon: "📝",
        colorClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        badgeClass: "badge-info",
      };
    }
    if (["xls", "xlsx", "csv", "ods"].includes(ext) || fileType.includes("sheet") || fileType.includes("excel") || fileType.includes("csv")) {
      return {
        label: "Spreadsheet",
        ext: ext.toUpperCase() || "XLS",
        icon: "📊",
        colorClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        badgeClass: "badge-success",
      };
    }
    if (["ppt", "pptx", "odp"].includes(ext) || fileType.includes("presentation") || fileType.includes("powerpoint")) {
      return {
        label: "Presentation",
        ext: ext.toUpperCase() || "PPT",
        icon: "📽️",
        colorClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
        badgeClass: "badge-warning",
      };
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext) || fileType.includes("zip") || fileType.includes("compressed")) {
      return {
        label: "Archive",
        ext: ext.toUpperCase() || "ZIP",
        icon: "🗜️",
        colorClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        badgeClass: "badge-warning",
      };
    }
    if (["txt", "md", "json", "js", "jsx", "ts", "tsx", "html", "css", "py", "java", "c", "cpp"].includes(ext)) {
      return {
        label: "Code / Text",
        ext: ext.toUpperCase() || "TXT",
        icon: "📑",
        colorClass: "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30",
        badgeClass: "badge-neutral",
      };
    }

    return {
      label: "Document",
      ext: ext.toUpperCase() || "DOC",
      icon: "📁",
      colorClass: "bg-primary/15 text-primary border-primary/30",
      badgeClass: "badge-primary",
    };
  };

  // Safe file download handler that works across origins
  const handleDownload = async (url, fileName) => {
    if (!url) return;
    try {
      toast.loading("Preparing download...", { id: "downloading" });
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started!", { id: "downloading" });
    } catch (err) {
      console.warn("Direct blob download failed, falling back to window open:", err);
      // Fallback
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.dismiss("downloading");
    }
  };

  // Open Lightbox Image Viewer
  const openImageViewer = (chat, senderName) => {
    const fullUrl = getFullFileUrl(chat.fileUrl);
    setZoomLevel(1);
    setRotation(0);
    setActiveImage({
      url: fullUrl,
      fileName: chat.fileName || "Photo",
      fileSize: chat.fileSize,
      senderName: senderName || (chat.senderId === user?._id ? "You" : receiver?.fullName),
      time: chat.createdAt,
      chatId: chat._id,
    });
  };

  // Navigate images in lightbox
  const allImagesInChat = filteredChatData.filter((c) => {
    const info = getDocTypeInfo(c.fileName, c.fileType, c.fileUrl, c.messageType);
    return c.fileUrl && info?.isImage;
  });

  const currentImageIndex = allImagesInChat.findIndex(
    (c) => c._id === activeImage?.chatId || getFullFileUrl(c.fileUrl) === activeImage?.url
  );

  const handleNextImage = () => {
    if (currentImageIndex !== -1 && currentImageIndex < allImagesInChat.length - 1) {
      const nextChat = allImagesInChat[currentImageIndex + 1];
      openImageViewer(nextChat);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      const prevChat = allImagesInChat[currentImageIndex - 1];
      openImageViewer(prevChat);
    }
  };

  // Close image viewer on Escape key, navigate with Left/Right
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeImage) return;
      if (e.key === "Escape") {
        setActiveImage(null);
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImage, currentImageIndex, allImagesInChat]);

  // Handle File Input Selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size exceeds 50MB limit");
        return;
      }
      setSelectedFile(file);
    }
    // reset input value so re-selecting the same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size exceeds 50MB limit");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Helper to process and optimize image for persistent instant sharing
  const processImageForSharing = (file) => {
    return new Promise((resolve) => {
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      const isImg =
        file.type.startsWith("image/") ||
        ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico", "avif"].includes(ext);

      if (!isImg) {
        resolve(null);
        return;
      }

      // For GIF or SVG or very small files, read as data URL directly to preserve animation/vector
      if (ext === "gif" || ext === "svg" || file.type === "image/gif" || file.type === "image/svg+xml" || file.size < 200 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) =>
          resolve({
            dataUrl: e.target.result,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || `image/${ext || "jpeg"}`,
          });
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
        return;
      }

      // Optimize image dimensions for smooth socket transfer and instant loading
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const MAX_DIM = 1920;
            let width = img.width;
            let height = img.height;
            if (width > MAX_DIM || height > MAX_DIM) {
              if (width > height) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              } else {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
            const quality = file.type === "image/png" ? undefined : 0.88;
            const dataUrl = canvas.toDataURL(mimeType, quality);

            resolve({
              dataUrl,
              fileName: file.name,
              fileSize: Math.round((dataUrl.length * 3) / 4),
              fileType: mimeType,
            });
          } catch (canvasErr) {
            console.warn("Canvas optimization fallback:", canvasErr);
            resolve({
              dataUrl: e.target.result,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type || "image/jpeg",
            });
          }
        };
        img.onerror = () => {
          resolve({
            dataUrl: e.target.result,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || "image/jpeg",
          });
        };
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Upload and Send Message / Document / Photo
  const handleMessageSendSocket = async () => {
    const hasText = Boolean(message.trim());
    const hasFile = Boolean(selectedFile);

    if ((!hasText && !hasFile) || !receiver?._id) return;

    let fileUrl = "";
    let fileName = "";
    let fileSize = 0;
    let fileType = "";
    let messageType = "text";

    if (hasFile) {
      setIsUploading(true);
      try {
        const ext = (selectedFile.name.split(".").pop() || "").toLowerCase();
        const isImage =
          selectedFile.type.startsWith("image/") ||
          ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico", "avif"].includes(ext);

        if (isImage) {
          // Process image to high-quality Base64 Data URL for instant rendering and permanent storage
          const imgData = await processImageForSharing(selectedFile);
          if (imgData?.dataUrl) {
            fileUrl = imgData.dataUrl;
            fileName = imgData.fileName;
            fileSize = imgData.fileSize;
            fileType = imgData.fileType;
            messageType = "image";
          }
        }

        // If not an image or if Base64 conversion was skipped, upload via FormData
        if (!fileUrl) {
          const formData = new FormData();
          formData.append("file", selectedFile);

          const uploadRes = await api.post("/user/upload-document", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (uploadRes.data?.data) {
            const data = uploadRes.data.data;
            fileUrl = data.fileUrl;
            fileName = data.fileName || selectedFile.name;
            fileSize = data.fileSize || selectedFile.size;
            fileType = data.fileType || selectedFile.type;
            messageType = isImage ? "image" : "document";
          } else {
            throw new Error("Failed to upload document");
          }
        }
      } catch (error) {
        console.error("File processing/upload failed:", error);
        toast.error(error.response?.data?.message || "Failed to process attached file");
        setIsUploading(false);
        return;
      }
    }

    const currentMessageText = message.trim();
    const timeStamp = new Date().toISOString();

    const payload = {
      senderID: user._id,
      receiverID: receiver._id,
      message: currentMessageText,
      messageType,
      fileUrl,
      fileName,
      fileSize,
      fileType,
    };

    try {
      if (socketAPI.connected) {
        socketAPI.emit("send", payload);

        setFilteredChatData((prev) => [
          ...prev,
          {
            _id: "temp-" + Date.now(),
            senderId: user._id,
            receiverId: receiver._id,
            message: currentMessageText,
            messageType: payload.messageType,
            fileUrl: payload.fileUrl,
            fileName: payload.fileName,
            fileSize: payload.fileSize,
            fileType: payload.fileType,
            createdAt: timeStamp,
            updatedAt: timeStamp,
          },
        ]);
      } else {
        const res = await api.post("/user/send-message", payload);
        if (res.data.data) {
          setFilteredChatData((prev) => [...prev, res.data.data]);
        }
      }

      setMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setReceiver(selectedFriend);
    setSelectedFile(null);
    fetchChatData();

    const handleReceiveMessage = (newMessagePack) => {
      const incomingSenderId = getSenderIdStr(newMessagePack.senderId);
      const incomingReceiverId = getSenderIdStr(newMessagePack.receiverId);
      const friendIdStr = selectedFriend?._id ? String(selectedFriend._id) : "";

      const isFromCurrentFriend =
        incomingSenderId === friendIdStr || incomingReceiverId === friendIdStr;

      if (isFromCurrentFriend) {
        setFilteredChatData((prev) => [...prev, newMessagePack]);
      }
    };

    if (selectedFriend) {
      socketAPI.on("receive", handleReceiveMessage);
    }

    return () => {
      socketAPI.off("receive", handleReceiveMessage);
    };
  }, [selectedFriend]);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  const getDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper to safely extract String ID
  const getSenderIdStr = (senderIdObj) => {
    if (!senderIdObj) return "";
    if (typeof senderIdObj === "object") {
      return senderIdObj._id ? String(senderIdObj._id) : String(senderIdObj);
    }
    return String(senderIdObj);
  };

  const addEmoji = (emojiStr) => {
    setMessage((prev) => prev + emojiStr);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className="flex flex-col h-full bg-base-200/40 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs z-50 flex flex-col items-center justify-center border-4 border-dashed border-primary m-3 rounded-2xl pointer-events-none animate-pulse">
          <div className="size-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl shadow-lg mb-2">
            📎
          </div>
          <p className="text-base font-bold text-primary">Drop document to attach</p>
          <p className="text-xs text-base-content/70 mt-1">Supports PDF, DOC, XLS, PPT, ZIP, Images & more</p>
        </div>
      )}

      {/* Top Navigation Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-2xs z-10 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="btn btn-ghost btn-circle btn-sm md:hidden text-base-content/70 hover:text-base-content"
              title="Back to contacts"
            >
              ←
            </button>
          )}

          <div className="avatar">
            <div className="size-11 rounded-full bg-gradient-to-tr from-primary via-accent to-secondary text-primary-content font-bold text-base flex items-center justify-center overflow-hidden ring-2 ring-primary/20 shadow-2xs">
              {receiver?.profilePic ? (
                <img
                  src={receiver.profilePic}
                  alt={receiver?.fullName || "Friend"}
                  className="size-full object-cover"
                />
              ) : (
                (receiver?.fullName?.[0] || "?").toUpperCase()
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-base text-base-content leading-tight">
              {receiver?.fullName || "Select a friend"}
            </h3>
            <p
              className={`text-xs font-medium flex items-center gap-1.5 mt-0.5 ${
                isOnline ? "text-success" : "text-base-content/40"
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  isOnline ? "bg-success animate-pulse" : "bg-base-content/30"
                }`}
              />
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary transition-colors"
            title="Audio Call"
          >
            📞
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 z-10">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : filteredChatData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-base-content/40">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-3 animate-float">
              💬
            </div>
            <p className="font-bold text-lg text-base-content">No messages yet</p>
            <p className="text-xs sm:text-sm mt-1">
              Start a conversation or send a document to {receiver?.fullName || "your contact"}.
            </p>
          </div>
        ) : (
          filteredChatData.map((chat, idx) => {
            const senderIdStr = getSenderIdStr(chat.senderId);
            const myIdStr = user?._id ? String(user._id) : user?.id ? String(user.id) : "";
            const isMe = Boolean(senderIdStr && myIdStr && senderIdStr === myIdStr);

            const currentDateLabel = getDateLabel(chat.createdAt);
            const prevDateLabel =
              idx > 0 ? getDateLabel(filteredChatData[idx - 1].createdAt) : null;
            const showDateHeader = currentDateLabel && currentDateLabel !== prevDateLabel;

            const hasDocument = Boolean(chat.fileUrl);
            const docInfo = hasDocument
              ? getDocTypeInfo(chat.fileName, chat.fileType)
              : null;
            const fullFileUrl = hasDocument ? getFullFileUrl(chat.fileUrl) : "";

            return (
              <React.Fragment key={chat._id || idx}>
                {/* Date Header Badge */}
                {showDateHeader && (
                  <div className="flex justify-center my-4">
                    <span className="badge badge-neutral text-[11px] px-3.5 py-1.5 font-semibold shadow-2xs rounded-full">
                      {currentDateLabel}
                    </span>
                  </div>
                )}

                {/* Message Block */}
                <div
                  className={`flex items-end gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Left Avatar */}
                  {!isMe && (
                    <div className="avatar shrink-0 mb-0.5">
                      <div className="size-7 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center overflow-hidden ring-1 ring-base-300 shadow-2xs">
                        {receiver?.profilePic ? (
                          <img
                            src={receiver.profilePic}
                            alt={receiver.fullName}
                            className="size-full object-cover"
                          />
                        ) : (
                          (receiver?.fullName?.[0] || "?").toUpperCase()
                        )}
                      </div>
                    </div>
                  )}

                  {/* Chat Box Container */}
                  <div
                    className={`w-fit max-w-[85%] sm:max-w-[65%] md:max-w-[55%] p-3 rounded-2xl shadow-xs border text-xs sm:text-sm transition-all ${
                      isMe
                        ? "bg-primary text-primary-content border-primary/30 rounded-br-xs"
                        : "bg-base-100 text-base-content border-base-300/80 rounded-bl-xs"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-bold mb-1 ${
                        isMe
                          ? "text-primary-content/80 text-right"
                          : "text-primary text-left"
                      }`}
                    >
                      {isMe ? "You" : receiver?.fullName}
                    </p>

                    {/* Photo / Document Card */}
                    {hasDocument && (
                      <div className="mb-1.5">
                        {/* Modern Image Bubble */}
                        {docInfo?.isImage ? (
                          <div className="relative group/img overflow-hidden rounded-2xl border border-white/10 dark:border-white/10 shadow-lg bg-black/10 transition-all duration-300 hover:shadow-2xl hover:border-primary/40">
                            {/* Photo Container with Click to Open Lightbox */}
                            <div
                              onClick={() => openImageViewer(chat, isMe ? "You" : receiver?.fullName)}
                              className="relative cursor-pointer overflow-hidden block"
                              title="Click to expand full photo"
                            >
                              <img
                                src={fullFileUrl}
                                alt={chat.fileName || "Shared photo"}
                                className="max-h-80 sm:max-h-96 w-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover/img:scale-104"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  const fallback = e.target.nextSibling;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                              
                              {/* Error Fallback */}
                              <div
                                style={{ display: "none" }}
                                className="p-6 flex-col items-center justify-center text-center bg-base-300/60 text-base-content/70 rounded-2xl min-h-[140px]"
                              >
                                <span className="text-3xl mb-1">🖼️</span>
                                <span className="text-xs font-semibold">Click to open photo</span>
                              </div>

                              {/* Subtle Bottom Dark Vignette Overlay for Text Legibility */}
                              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

                              {/* Floating Hover Action Dock (Zoom, Download, Copy) */}
                              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px] p-3">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openImageViewer(chat, isMe ? "You" : receiver?.fullName);
                                  }}
                                  className="btn btn-circle btn-sm bg-black/70 hover:bg-primary text-white border-white/20 shadow-xl backdrop-blur-md hover:scale-110 transition-transform"
                                  title="Expand full screen"
                                >
                                  🔍
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(fullFileUrl, chat.fileName || "photo");
                                  }}
                                  className="btn btn-circle btn-sm bg-black/70 hover:bg-primary text-white border-white/20 shadow-xl backdrop-blur-md hover:scale-110 transition-transform"
                                  title="Download high-res"
                                >
                                  ⬇
                                </button>
                              </div>

                              {/* Inset Photo Badge (File Name & Size) */}
                              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow-md pointer-events-none">
                                <span className="text-[11px] font-medium truncate max-w-[170px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                                  📷 {chat.fileName || "Photo"}
                                </span>
                                {chat.fileSize ? (
                                  <span className="text-[10px] bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10 text-white/80">
                                    {formatFileSize(chat.fileSize)}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Modern Document Card */
                          <div
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 ${
                              isMe
                                ? "bg-black/20 border-white/25 text-primary-content hover:bg-black/30"
                                : "bg-base-200/80 border-base-300 text-base-content hover:bg-base-200 shadow-xs"
                            }`}
                          >
                            <div
                              className={`size-12 rounded-xl flex flex-col items-center justify-center shrink-0 border shadow-xs font-bold ${
                                isMe
                                  ? "bg-white/20 text-primary-content border-white/30"
                                  : docInfo?.colorClass
                              }`}
                            >
                              <span className="text-xl leading-none">{docInfo?.icon}</span>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold mt-1">
                                {docInfo?.ext}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0 pr-1">
                              <p
                                className="font-semibold text-xs sm:text-sm truncate leading-tight"
                                title={chat.fileName}
                              >
                                {chat.fileName || "Document"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-[10px] font-medium opacity-85 ${
                                    isMe ? "text-primary-content/85" : "text-base-content/70"
                                  }`}
                                >
                                  {formatFileSize(chat.fileSize)}
                                </span>
                                <span className="opacity-40">•</span>
                                <span
                                  className={`text-[10px] font-medium opacity-85 ${
                                    isMe ? "text-primary-content/85" : "text-base-content/70"
                                  }`}
                                >
                                  {docInfo?.label}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDownload(fullFileUrl, chat.fileName || "document")}
                              className={`btn btn-circle btn-sm shrink-0 shadow-sm transition-transform hover:scale-105 ${
                                isMe
                                  ? "btn-secondary text-secondary-content border-0"
                                  : "btn-primary text-primary-content border-0"
                              }`}
                              title={`Download ${chat.fileName}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="size-4"
                              >
                                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Text Message Content (if any) */}
                    {chat.message && (
                      <p className="leading-relaxed whitespace-pre-wrap break-words font-medium">
                        {chat.message}
                      </p>
                    )}

                    {/* Footer Time & Status */}
                    <div
                      className={`flex items-center gap-1 text-[9px] mt-1 ${
                        isMe
                          ? "justify-end text-primary-content/75"
                          : "justify-start text-base-content/40"
                      }`}
                    >
                      <span>{formatTime(chat.createdAt)}</span>
                      {isMe && <span className="font-bold text-[9px]">✓✓</span>}
                    </div>
                  </div>

                  {/* Right Avatar */}
                  {isMe && (
                    <div
                      className="avatar shrink-0 mb-0.5 cursor-pointer hover:scale-110 transition-transform"
                      onClick={handleProfileClick}
                      title={
                        location.pathname === "/settings" ||
                        location.pathname === "/dashboard"
                          ? "Close Settings"
                          : "Open Settings"
                      }
                    >
                      <div className="size-7 rounded-full bg-primary text-primary-content font-bold text-xs flex items-center justify-center overflow-hidden ring-1 ring-primary/30 shadow-2xs">
                        {user?.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt="You"
                            className="size-full object-cover"
                          />
                        ) : (
                          (user?.fullName?.[0] || "Y").toUpperCase()
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message Input Footer */}
      <div className="px-4 py-3 bg-base-100/90 backdrop-blur-md border-t border-base-300 z-10 shrink-0 relative">
        {/* Hidden File Input for Documents */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z,.tar,.gz,.json,.md,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.ico"
        />

        {/* Selected Document Staging Preview Banner */}
        {selectedFile && (
          <div className="mb-2 max-w-4xl mx-auto p-2.5 bg-base-200/90 rounded-xl border border-base-300 flex items-center justify-between shadow-xs animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`size-9 rounded-lg flex items-center justify-center text-base border shrink-0 ${
                  getDocTypeInfo(selectedFile.name, selectedFile.type).colorClass
                }`}
              >
                {getDocTypeInfo(selectedFile.name, selectedFile.type).icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-base-content truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-base-content/60">
                  {formatFileSize(selectedFile.size)} •{" "}
                  {getDocTypeInfo(selectedFile.name, selectedFile.type).label}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
              className="btn btn-ghost btn-circle btn-xs text-base-content/60 hover:text-error"
              title="Remove attachment"
            >
              ✕
            </button>
          </div>
        )}

        {/* Emoji Quick Bar Popup */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-4 mb-2 p-2 bg-base-100 rounded-2xl shadow-xl border border-base-300 flex items-center gap-1.5 z-50">
            {["😊", "👍", "❤️", "😂", "🔥", "🚀", "🎉", "😍", "📎", "📄"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="btn btn-ghost btn-circle btn-sm text-lg hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="btn btn-ghost btn-circle btn-sm text-xl shrink-0 hover:bg-base-200"
            title="Add Emoji"
          >
            😊
          </button>

          {/* Document / File Attach Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`btn btn-circle btn-sm shrink-0 transition-transform hover:scale-105 ${
              selectedFile
                ? "btn-primary shadow-xs"
                : "btn-ghost text-base-content/70 hover:text-primary hover:bg-base-200"
            }`}
            title="Attach Document or Photo (PDF, Images, Word, Excel, PPT, Zip, etc.)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
              />
            </svg>
          </button>

          {/* Text Message Input */}
          <input
            type="text"
            className="input input-bordered flex-1 text-sm focus:outline-none focus:border-primary rounded-xl"
            placeholder={
              selectedFile
                ? "Add a caption for your photo or document (optional)..."
                : "Type a message or attach a photo / document..."
            }
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            disabled={isUploading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleMessageSendSocket();
              }
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleMessageSendSocket}
            className="btn btn-primary btn-circle shrink-0 shadow-md shadow-primary/20 hover:scale-105 transition-transform"
            disabled={(!message.trim() && !selectedFile) || isUploading}
            title="Send"
          >
            {isUploading ? (
              <span className="loading loading-spinner loading-xs text-primary-content" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Full-Screen Image Lightbox / Viewer Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between animate-fadeIn select-none"
          onClick={() => setActiveImage(null)}
        >
          {/* Lightbox Top Bar */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-b from-black/90 to-transparent z-10 shrink-0 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setActiveImage(null)}
                className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20 border-white/20"
                title="Close (Esc)"
              >
                ✕
              </button>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate max-w-[180px] sm:max-w-md">
                  {activeImage.fileName || "Photo"}
                </p>
                <p className="text-[11px] text-white/70">
                  Shared by {activeImage.senderName}{" "}
                  {activeImage.time ? `• ${formatTime(activeImage.time)}` : ""}{" "}
                  {activeImage.fileSize ? `• ${formatFileSize(activeImage.fileSize)}` : ""}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20"
                title="Zoom Out (-)"
              >
                -
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="btn btn-xs btn-ghost text-white/90 hover:bg-white/20 px-2 font-mono text-[11px]"
                title="Reset Zoom (100%)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20"
                title="Zoom In (+)"
              >
                +
              </button>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20"
                title="Rotate 90°"
              >
                🔄
              </button>
              <a
                href={activeImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20"
                title="Open in new tab"
              >
                ↗
              </a>
              <button
                onClick={() => handleDownload(activeImage.url, activeImage.fileName)}
                className="btn btn-sm btn-primary ml-1 gap-1 rounded-xl shadow-lg font-semibold text-xs"
                title="Download full photo"
              >
                ⬇ Download
              </button>
            </div>
          </div>

          {/* Center Image Container with Navigation */}
          <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
            {/* Previous Photo Button */}
            {allImagesInChat.length > 1 && currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-md bg-black/60 hover:bg-black/90 text-white border-white/20 shadow-2xl transition-transform hover:scale-110"
                title="Previous Photo (Left Arrow)"
              >
                ◀
              </button>
            )}

            {/* Main Image View */}
            <div
              className="max-h-full max-w-full flex items-center justify-center transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage.url}
                alt={activeImage.fileName}
                className="max-h-[76vh] max-w-[88vw] object-contain rounded-lg shadow-2xl border border-white/10"
              />
            </div>

            {/* Next Photo Button */}
            {allImagesInChat.length > 1 &&
              currentImageIndex < allImagesInChat.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-md bg-black/60 hover:bg-black/90 text-white border-white/20 shadow-2xl transition-transform hover:scale-110"
                  title="Next Photo (Right Arrow)"
                >
                  ▶
                </button>
              )}
          </div>

          {/* Bottom Bar Info / Helper */}
          <div
            className="py-2.5 px-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-4 text-xs text-white/70 shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Click photo or backdrop to close • Use Esc key or arrow keys</span>
            {allImagesInChat.length > 1 && (
              <span className="badge badge-neutral text-white bg-white/20 border-0">
                {currentImageIndex + 1} of {allImagesInChat.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatting;