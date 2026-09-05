import React, { useEffect, useState } from "react";
import { userData } from "../assets/dummy";
import Chatting from "../components/chat/Chatting";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import socketAPI from "../config/webSocket";

const Chat = () => {
  const navigate = useNavigate();
  const { user, isLogin } = useAuth();
  const [recentUser, setRecentUser] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isOpenChat, setIsOpenChat] = useState(false);

  const fetchRecentUsers = async () => {
    // Simulate fetching recent users from an API
    try {
      const res = await api.get("/user/allusers");
      setRecentUser(res.data.data);
    } catch (error) {
      console.error("Failed to fetch recent users", error);
    }
  };

  // console.log(user);
  //const currentUser = 1;
  console.log(recentUser);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }

    if (isLogin && user) {
      socketAPI.emit("OmBhramyaNamah", user._id);
      fetchRecentUsers();
    }

    return () => {
      socketAPI.emit("OmNamahShivay", user._id);
    };
  }, []);

  return (
    <>
      {isLogin && (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          {/* Sidebar */}
          <div className="w-72 shrink-0 bg-base-100 border-r border-base-300 flex flex-col">
            <div className="px-4 py-3 border-b border-base-300">
              <h2 className="text-lg font-bold text-base-content">Chats</h2>
              <p className="text-xs text-base-content/40">{recentUser.length} contacts</p>
            </div>

            <div className="overflow-y-auto flex-1">
              {recentUser.length > 0 ? (
                recentUser.map((friend, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setSelectedFriend(friend); setIsOpenChat(true); }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-base-200 transition-colors ${
                      selectedFriend?._id === friend._id
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="avatar shrink-0">
                      <div className="size-10 rounded-full bg-primary text-primary-content font-bold text-sm flex items-center justify-center overflow-hidden">
                        {friend.profilePic ? (
                          <img src={friend.profilePic} alt={friend.fullName} className="size-full object-cover" />
                        ) : (
                          (friend.fullName?.[0] || "U").toUpperCase()
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-base-content truncate">{friend.fullName}</p>
                      <p className="text-xs text-base-content/40 truncate">{friend.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-base-content/30">
                  <span className="text-5xl">👥</span>
                  <p className="mt-3 text-sm">No contacts found</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col bg-base-200 overflow-hidden">
            {selectedFriend ? (
              <Chatting selectedFriend={selectedFriend} currentUser={user} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-base-content/30 gap-3">
                <span className="text-7xl">💬</span>
                <p className="text-xl font-semibold">Select a conversation</p>
                <p className="text-sm">Pick a contact from the left to start chatting</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;