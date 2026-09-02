import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api";
import socketAPI from "../../config/webSocket";

const Chatting = ({ selectedFriend, currentUser }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const [filteredChatData, setFilteredChatData] = useState([]);
  const [receiver, setReceiver] = useState(selectedFriend);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleMessageSendSocket = async () => {
    if (!message.trim() || !receiver?._id) return;

    const currentMessageText = message.trim();
    const timeStamp = new Date().toISOString();

    const payload = {
      senderID: user._id,
      receiverID: receiver._id,
      message: currentMessageText,
    };

    try {
      if (socketAPI.connected) {
        socketAPI.emit("send", payload);

        setFilteredChatData((prev) => [
          ...prev,
          {
            senderId: user._id,
            receiverId: receiver._id,
            message: currentMessageText,
            createdAt: timeStamp,
            updatedAt: timeStamp,
          },
        ]);
        setMessage("");
      } else {
        const res = await api.post("/user/send-message", {
          receiverID: receiver._id,
          message: currentMessageText,
        });
        if (res.data.data) {
          setFilteredChatData((prev) => [...prev, res.data.data]);
          setMessage("");
        }
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useEffect(() => {
    setReceiver(selectedFriend);
    fetchChatData();

    const handleReceiveMessage = (newMessagePack) => {
      const isFromCurrentFriend =
        String(newMessagePack.senderId) === String(selectedFriend._id) ||
        String(newMessagePack.receiverId) === String(selectedFriend._id);

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

  // Helper to safely extract String ID regardless of whether object or string
  const getSenderIdStr = (senderIdObj) => {
    if (!senderIdObj) return "";
    if (typeof senderIdObj === "object") {
      return senderIdObj._id ? String(senderIdObj._id) : String(senderIdObj);
    }
    return String(senderIdObj);
  };

  return (
    <div className="flex flex-col h-full bg-base-200/50 relative overflow-hidden">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-base-100 border-b border-base-300 shadow-xs z-10 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="avatar">
            <div className="size-11 rounded-full bg-primary text-primary-content font-bold text-base flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
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
            <p className="text-xs text-success font-medium flex items-center gap-1.5 mt-0.5">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content" title="Call">
            📞
          </button>
          <button className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content" title="Video">
            📹
          </button>
        </div>
      </div>

      {/* Messages Stream - Separated Left & Right */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 z-10">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : filteredChatData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-base-content/40">
            <span className="text-6xl mb-3">💬</span>
            <p className="font-bold text-lg text-base-content">No messages yet</p>
            <p className="text-sm mt-1">Start a conversation with {receiver?.fullName || "your friend"}.</p>
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

            return (
              <React.Fragment key={idx}>
                {/* Date Header Badge */}
                {showDateHeader && (
                  <div className="flex justify-center my-4">
                    <span className="badge badge-neutral text-xs px-3.5 py-2 font-semibold shadow-xs">
                      {currentDateLabel}
                    </span>
                  </div>
                )}

                {/* Left (Received) vs Right (Sent) Message Block */}
                <div className={`flex items-end gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}>
                  
                  {/* Left Avatar (Received Messages) */}
                  {!isMe && (
                    <div className="avatar shrink-0 mb-0.5">
                      <div className="size-6 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center overflow-hidden ring-1 ring-base-300">
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

                  {/* Chat Box Container - Compact Size */}
                  <div
                    className={`w-fit max-w-[55%] sm:max-w-[40%] px-3 py-1.5 rounded-xl shadow-2xs border text-xs ${
                      isMe
                        ? "bg-primary text-primary-content border-primary/30 rounded-br-xs"
                        : "bg-base-100 dark:bg-base-300 text-base-content border-base-300 rounded-bl-xs"
                    }`}
                  >
                    {/* Header Label inside box */}
                    <p
                      className={`text-[9.5px] font-bold mb-0.5 ${
                        isMe ? "text-primary-content/80 text-right" : "text-primary text-left"
                      }`}
                    >
                      {isMe ? "You" : receiver?.fullName}
                    </p>

                    {/* Message Body */}
                    <p className="leading-snug whitespace-pre-wrap break-words">{chat.message}</p>

                    {/* Footer Info inside box */}
                    <div
                      className={`flex items-center gap-1 text-[9px] mt-0.5 ${
                        isMe ? "justify-end text-primary-content/75" : "justify-start text-base-content/40"
                      }`}
                    >
                      <span>{formatTime(chat.createdAt)}</span>
                      {isMe && <span className="font-bold text-[9px]">✓✓</span>}
                    </div>
                  </div>

                  {/* Right Avatar (Sent Messages) */}
                  {isMe && (
                    <div className="avatar shrink-0 mb-0.5">
                      <div className="size-6 rounded-full bg-primary text-primary-content font-bold text-[10px] flex items-center justify-center overflow-hidden ring-1 ring-primary/30">
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
      <div className="px-4 py-3 bg-base-100 border-t border-base-300 z-10 shrink-0">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <button className="btn btn-ghost btn-circle btn-sm text-xl shrink-0">😊</button>

          <input
            type="text"
            className="input input-bordered flex-1 text-sm focus:outline-none focus:border-primary"
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleMessageSendSocket();
              }
            }}
          />

          <button
            onClick={handleMessageSendSocket}
            className="btn btn-primary btn-circle shrink-0"
            disabled={!message.trim()}
            title="Send Message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatting;