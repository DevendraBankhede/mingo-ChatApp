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

  // Helper to get backend base URL for downloads
  const getFullFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const serverOrigin = rawBaseUrl.replace(/\/api\/?$/, "");
    return `${serverOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Helper to get document info and styling
  const getDocTypeInfo = (fileName = "", fileType = "") => {
    const ext = (fileName.split(".").pop() || "").toLowerCase();

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
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext) || fileType.startsWith("image/")) {
      return {
        label: "Image",
        ext: ext.toUpperCase() || "IMG",
        icon: "🖼️",
        isImage: true,
        colorClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        badgeClass: "badge-secondary",
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

  // Upload and Send Message / Document
  const handleMessageSendSocket = async () => {
    const hasText = Boolean(message.trim());
    const hasFile = Boolean(selectedFile);

    if ((!hasText && !hasFile) || !receiver?._id) return;

    let uploadedFileData = null;

    if (hasFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await api.post("/user/upload-document", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (uploadRes.data?.data) {
          uploadedFileData = uploadRes.data.data;
        } else {
          throw new Error("Failed to upload document");
        }
      } catch (error) {
        console.error("Document upload failed:", error);
        toast.error(error.response?.data?.message || "Failed to upload document");
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
      messageType: uploadedFileData ? "document" : "text",
      fileUrl: uploadedFileData?.fileUrl || "",
      fileName: uploadedFileData?.fileName || "",
      fileSize: uploadedFileData?.fileSize || 0,
      fileType: uploadedFileData?.fileType || "",
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

                    {/* Document Card (if attached) */}
                    {hasDocument && (
                      <div className="mb-2">
                        {/* Image Preview if it's an image file */}
                        {docInfo?.isImage ? (
                          <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 mb-1.5 bg-base-200/50">
                            <a
                              href={fullFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Click to view full image"
                              className="block group relative"
                            >
                              <img
                                src={fullFileUrl}
                                alt={chat.fileName || "Shared image"}
                                className="max-h-64 w-full object-cover rounded-xl transition-transform group-hover:scale-102"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="badge badge-neutral text-xs shadow-md">
                                  🔍 View Full
                                </span>
                              </div>
                            </a>
                            <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] bg-base-100/70 text-base-content backdrop-blur-xs">
                              <span className="truncate max-w-[160px] font-medium">
                                {chat.fileName || "Image"}
                              </span>
                              <a
                                href={fullFileUrl}
                                download={chat.fileName || "download"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-primary hover:underline ml-2"
                              >
                                ⬇ Download
                              </a>
                            </div>
                          </div>
                        ) : (
                          /* Document Card representation */
                          <div
                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                              isMe
                                ? "bg-black/15 border-white/20 text-primary-content hover:bg-black/25"
                                : "bg-base-200/70 border-base-300 text-base-content hover:bg-base-200"
                            }`}
                          >
                            <div
                              className={`size-11 rounded-lg flex flex-col items-center justify-center shrink-0 border font-bold ${
                                isMe
                                  ? "bg-white/20 text-primary-content border-white/30"
                                  : docInfo?.colorClass
                              }`}
                            >
                              <span className="text-lg leading-none">{docInfo?.icon}</span>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold mt-0.5">
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
                                  className={`text-[10px] font-medium opacity-80 ${
                                    isMe ? "text-primary-content/80" : "text-base-content/60"
                                  }`}
                                >
                                  {formatFileSize(chat.fileSize)}
                                </span>
                                <span className="opacity-40">•</span>
                                <span
                                  className={`text-[10px] font-medium opacity-80 ${
                                    isMe ? "text-primary-content/80" : "text-base-content/60"
                                  }`}
                                >
                                  {docInfo?.label}
                                </span>
                              </div>
                            </div>

                            <a
                              href={fullFileUrl}
                              download={chat.fileName || "document"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`btn btn-circle btn-sm shrink-0 shadow-2xs ${
                                isMe
                                  ? "btn-secondary text-secondary-content"
                                  : "btn-primary text-primary-content"
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
                            </a>
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
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z,.tar,.gz,.json,.md,.jpg,.jpeg,.png,.webp,.gif"
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
            title="Attach Document or File (PDF, Word, Excel, PPT, Zip, etc.)"
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
                ? "Add a caption for your document (optional)..."
                : "Type a message or attach a document..."
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
    </div>
  );
};

export default Chatting;