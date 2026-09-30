import React, { useEffect, useState } from "react";
import Chatting from "../components/chat/Chatting";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../config/api";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLogin, onlineUsers } = useAuth();

  const handleProfileClick = () => {
    if (location.pathname === "/settings" || location.pathname === "/dashboard") {
      navigate("/chat");
    } else {
      navigate("/settings");
    }
  };

  const [recentUser, setRecentUser] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecentUsers = async () => {
    try {
      const res = await api.get("/user/allusers");
      setRecentUser(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch recent users", error);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    } else {
      fetchRecentUsers();
    }
  }, [isLogin]);

  const isFriendOnline = (friend) => {
    if (!friend || !onlineUsers) return false;
    const id1 = friend._id ? String(friend._id) : null;
    const id2 = friend.id ? String(friend.id) : null;
    return Boolean(
      (id1 && onlineUsers[id1]) ||
      (id2 && onlineUsers[id2]) ||
      onlineUsers[friend._id] ||
      onlineUsers[friend.id]
    );
  };

  const filteredContacts = recentUser.filter(
    (friend) =>
      friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isLogin && (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          {/* Sidebar */}
          <div
            className={`w-full md:w-80 shrink-0 bg-base-100 border-r border-base-300 flex-col ${
              selectedFriend ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="px-4 py-3.5 border-b border-base-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="avatar cursor-pointer hover:scale-105 transition-transform"
                    onClick={handleProfileClick}
                    title={
                      location.pathname === "/settings" || location.pathname === "/dashboard"
                        ? "Close Settings"
                        : "Open Settings & Account"
                    }
                  >
                    <div className="size-8 rounded-full bg-primary text-primary-content font-bold text-xs flex items-center justify-center overflow-hidden ring-2 ring-primary/30 shadow-xs">
                      {user?.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.fullName}
                          className="size-full object-cover"
                        />
                      ) : (
                        (user?.fullName?.[0] || user?.email?.[0] || "U").toUpperCase()
                      )}
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-base-content tracking-tight">Messages</h2>
                </div>
                <span className="badge badge-neutral text-xs font-bold px-2.5">
                  {filteredContacts.length}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-sm input-bordered w-full pl-8 text-xs focus:outline-none focus:border-primary rounded-lg"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/40 text-xs">
                  🔍
                </span>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-base-200/50">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((friend) => {
                  const isUserOnline = isFriendOnline(friend);

                  return (
                    <div
                      key={friend._id || friend.id}
                      onClick={() => setSelectedFriend(friend)}
                      className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-base-200/70 transition-all ${
                        selectedFriend?._id === friend._id || selectedFriend?.id === friend.id
                          ? "bg-primary/10 border-l-4 border-primary"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="avatar shrink-0 relative">
                        <div className="size-11 rounded-full bg-gradient-to-tr from-primary to-accent text-primary-content font-bold text-sm flex items-center justify-center overflow-hidden ring-2 ring-primary/20 shadow-2xs">
                          {friend.profilePic ? (
                            <img
                              src={friend.profilePic}
                              alt={friend.fullName}
                              className="size-full object-cover"
                            />
                          ) : (
                            (friend.fullName?.[0] || "U").toUpperCase()
                          )}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-base-100 ${
                            isUserOnline ? "bg-success animate-pulse" : "bg-base-content/30"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-base-content truncate">
                            {friend.fullName}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isUserOnline
                                ? "text-success bg-success/15 font-bold"
                                : "text-base-content/40 bg-base-200"
                            }`}
                          >
                            {isUserOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                        <p className="text-xs text-base-content/50 truncate mt-0.5">{friend.email}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-base-content/30 px-4 text-center">
                  <span className="text-4xl mb-2">🔍</span>
                  <p className="text-sm font-semibold text-base-content/60">No contacts found</p>
                  <p className="text-xs text-base-content/40 mt-1">
                    Try searching with a different name or email
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div
            className={`flex-1 flex-col bg-base-200 overflow-hidden ${
              selectedFriend ? "flex" : "hidden md:flex"
            }`}
          >
            {selectedFriend ? (
              <Chatting
                selectedFriend={selectedFriend}
                currentUser={user}
                isOnline={isFriendOnline(selectedFriend)}
                onBack={() => setSelectedFriend(null)}
              />
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