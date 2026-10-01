import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isLogin } = useAuth();

  // Interactive Live Chat Demo State
  const [activeDemoContact, setActiveDemoContact] = useState(0);
  const [demoInput, setDemoInput] = useState("");
  const [demoMessages, setDemoMessages] = useState([
    {
      id: 1,
      sender: "Alice",
      isMe: false,
      text: "Hey there! Have you tried the new photo sharing on Mingo? ⚡",
      time: "10:42 AM",
    },
    {
      id: 2,
      sender: "You",
      isMe: true,
      text: "Yes! The photos open instantly in the lightbox with full zoom and zero lag! 🚀",
      time: "10:43 AM",
    },
    {
      id: 3,
      sender: "Alice",
      isMe: false,
      isImage: true,
      imageSrc:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      fileName: "mountain_sunset.jpg",
      fileSize: "1.4 MB",
      caption: "Check out this view from my hike today! 🏔️✨",
      time: "10:44 AM",
    },
  ]);

  const demoContacts = [
    {
      id: 0,
      name: "Alice Vance",
      avatar: "👩‍💼",
      status: "Online",
      unread: 0,
      lastMsg: "Check out this view from my hike...",
    },
    {
      id: 1,
      name: "Alex Rivera",
      avatar: "👨‍💻",
      status: "Online",
      unread: 2,
      lastMsg: "Let's test the new WebSocket stream!",
    },
    {
      id: 2,
      name: "Sarah Miller",
      avatar: "🎨",
      status: "Offline",
      unread: 0,
      lastMsg: "Theme switcher looks amazing 🔥",
    },
  ];

  const handleSendDemoMessage = (e) => {
    e.preventDefault();
    if (!demoInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "You",
      isMe: true,
      text: demoInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setDemoMessages((prev) => [...prev, newMsg]);
    setDemoInput("");

    // Simulate auto-reply from active contact
    setTimeout(() => {
      setDemoMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: demoContacts[activeDemoContact].name.split(" ")[0],
          isMe: false,
          text: "Love how fast messages sync in real time! ✨💯",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="bg-base-100 text-base-content min-h-screen overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* HERO SECTION (Design 3 - Telegram & Notion Minimalist SaaS Style) */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-primary/15 via-accent/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold text-xs shadow-xs"
          >
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span>A New Standard for Modern Conversations</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]"
          >
            Lightning-Fast Messaging,{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Zero Friction.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto font-normal leading-relaxed px-2"
          >
            Mingo redefines communication with seamless design, unparalleled WebSocket speed,
            encrypted auth, and instant high-res photo sharing.
          </motion.p>

          {/* CTA Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none"
          >
            {isLogin ? (
              <button
                onClick={() => navigate("/chat")}
                className="btn btn-primary btn-md sm:btn-lg rounded-2xl px-6 sm:px-8 font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-transform w-full sm:w-auto"
              >
                <span>💬</span> Open Chat App
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="btn btn-primary btn-md sm:btn-lg rounded-2xl px-6 sm:px-8 font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-transform w-full sm:w-auto"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-outline btn-md sm:btn-lg rounded-2xl px-6 sm:px-8 font-semibold hover:bg-base-200 w-full sm:w-auto"
                >
                  Sign In
                </button>
              </>
            )}
          </motion.div>

          {/* Metrics / Social Proof Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-base-200 text-center"
          >
            {[
              { label: "Delivery Latency", value: "< 15ms" },
              { label: "Socket Reliability", value: "99.9%" },
              { label: "End-to-End Auth", value: "JWT + OAuth" },
              { label: "Free Forever", value: "100%" },
            ].map(({ label, value }) => (
              <div key={label} className="p-2">
                <p className="text-xl sm:text-2xl font-black text-base-content">{value}</p>
                <p className="text-[11px] text-base-content/60 font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* INTERACTIVE LIVE CHATROOM SHOWCASE (Design 3 Centerpiece) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-4xl mx-auto mt-14"
        >
          {/* Main Desktop Container Frame */}
          <div className="card bg-base-200/90 backdrop-blur-2xl border border-base-300 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/10">
            {/* Top Mac/App Window Bar */}
            <div className="px-5 py-3 bg-base-300/60 border-b border-base-300 flex items-center justify-between text-xs text-base-content/60">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-error/80" />
                <span className="size-3 rounded-full bg-warning/80" />
                <span className="size-3 rounded-full bg-success/80" />
                <span className="ml-2 font-mono text-[11px] font-semibold text-base-content/70 hidden sm:inline">
                  mingo-chat-preview.app
                </span>
              </div>
              <div className="badge badge-success/15 text-success border-success/30 font-bold text-[10px] gap-1">
                <span className="size-1.5 rounded-full bg-success animate-ping" />
                Live WebSocket Channel
              </div>
            </div>

            {/* Split Screen Workspace: Sidebar + Chat Room */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
              {/* Left Contacts Sidebar (4 cols on desktop) */}
              <div className="hidden md:block md:col-span-4 border-r border-base-300/80 bg-base-100/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between px-2 py-1 mb-2">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-base-content/60">
                    Contacts
                  </span>
                  <span className="badge badge-primary badge-xs">3 Online</span>
                </div>

                {demoContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveDemoContact(contact.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left ${
                      activeDemoContact === contact.id
                        ? "bg-primary text-primary-content shadow-sm"
                        : "hover:bg-base-200/80 text-base-content"
                    }`}
                  >
                    <div className="relative">
                      <div className="size-10 rounded-full bg-base-300 flex items-center justify-center text-lg shadow-2xs">
                        {contact.avatar}
                      </div>
                      {contact.status === "Online" && (
                        <span className="absolute bottom-0 right-0 size-2.5 bg-success rounded-full ring-2 ring-base-100" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs truncate">{contact.name}</p>
                        {contact.unread > 0 && (
                          <span className="badge badge-secondary badge-xs font-bold">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[10px] truncate ${
                          activeDemoContact === contact.id
                            ? "text-primary-content/80"
                            : "text-base-content/60"
                        }`}
                      >
                        {contact.lastMsg}
                      </p>
                    </div>
                  </button>
                ))}

                <div className="pt-4 px-2">
                  <div className="p-3 rounded-2xl bg-base-200/60 border border-base-300/60 text-center space-y-1">
                    <p className="text-[11px] font-bold text-base-content">Interactive Preview</p>
                    <p className="text-[9px] text-base-content/60">Type a test message below to chat!</p>
                  </div>
                </div>
              </div>

              {/* Right Chat Stream (8 cols on desktop) */}
              <div className="col-span-1 md:col-span-8 flex flex-col bg-base-100/40">
                {/* Chat Top Header */}
                <div className="px-4 py-3 bg-base-200/40 border-b border-base-300/80 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-gradient-to-tr from-primary to-accent text-primary-content flex items-center justify-center text-base shadow-xs">
                      {demoContacts[activeDemoContact].avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-base-content leading-tight">
                        {demoContacts[activeDemoContact].name}
                      </h4>
                      <p className="text-[10px] text-success font-medium flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-success inline-block animate-pulse" />
                        Online
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="btn btn-ghost btn-circle btn-xs text-base-content/60">
                      📞
                    </button>
                    <button className="btn btn-ghost btn-circle btn-xs text-base-content/60">
                      📹
                    </button>
                  </div>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[320px]">
                  <AnimatePresence initial={false}>
                    {demoMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                      >
                        {msg.isImage ? (
                          /* Modern Glassmorphic Photo Bubble (Design 1 in Chat Showcase) */
                          <div
                            className={`relative rounded-3xl overflow-hidden border p-1 shadow-lg max-w-[85%] sm:max-w-[70%] ${
                              msg.isMe
                                ? "bg-primary border-primary/30"
                                : "bg-base-200 border-base-300"
                            }`}
                          >
                            <div className="relative rounded-2xl overflow-hidden">
                              <img
                                src={msg.imageSrc}
                                alt={msg.fileName}
                                className="h-44 w-full object-cover rounded-2xl"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
                                <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 font-medium">
                                  📷 {msg.fileName}
                                </span>
                                <span className="bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10">
                                  {msg.time} {msg.isMe && "✓✓"}
                                </span>
                              </div>
                            </div>
                            {msg.caption && (
                              <p
                                className={`text-xs px-2.5 py-2 font-medium ${
                                  msg.isMe ? "text-primary-content" : "text-base-content"
                                }`}
                              >
                                {msg.caption}
                              </p>
                            )}
                          </div>
                        ) : (
                          /* Text Message Bubble */
                          <div
                            className={`p-3 rounded-2xl max-w-[85%] sm:max-w-[70%] shadow-xs text-xs sm:text-sm font-medium ${
                              msg.isMe
                                ? "bg-primary text-primary-content rounded-br-xs"
                                : "bg-base-200 text-base-content border border-base-300/70 rounded-bl-xs"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span
                              className={`block text-[9px] text-right mt-1 font-mono ${
                                msg.isMe ? "text-primary-content/80" : "text-base-content/50"
                              }`}
                            >
                              {msg.time} {msg.isMe && "✓✓"}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  <div className="flex items-center gap-2 text-base-content/50 text-[10px]">
                    <span>{demoContacts[activeDemoContact].name.split(" ")[0]} is active</span>
                    <span className="flex gap-0.5">
                      <span className="size-1 rounded-full bg-primary animate-bounce" />
                      <span className="size-1 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                      <span className="size-1 rounded-full bg-secondary animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                </div>

                {/* Live Message Input Bar */}
                <form
                  onSubmit={handleSendDemoMessage}
                  className="p-3 bg-base-200/50 border-t border-base-300 flex items-center gap-2 shrink-0"
                >
                  <span className="text-base cursor-pointer hover:scale-110 transition-transform">
                    😊
                  </span>
                  <span className="text-base cursor-pointer hover:scale-110 transition-transform">
                    📎
                  </span>
                  <input
                    type="text"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder="Type a test message..."
                    className="input input-bordered input-sm flex-1 text-xs rounded-xl focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm btn-circle shrink-0 shadow-sm"
                    title="Send"
                  >
                    🚀
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STRUCTURED SAAS FEATURE GRID (6 Cards) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-base-200/50 border-t border-base-300/80 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="badge badge-primary font-bold text-xs px-3 py-1 rounded-full">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Speed, Clarity & Privacy
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base">
              Everything you need for effortless real-time communication without cluttered bloat.
            </p>
          </div>

          {/* 6 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Instant WebSocket Sync",
                desc: "Bi-directional WebSocket streams deliver messages in sub-15ms with full delivery verification checkmarks.",
                badge: "Real-Time",
              },
              {
                icon: "🖼️",
                title: "Instant Photo & Media Sharing",
                desc: "Send high-res photos and documents with integrated full-screen lightbox zoom, 90° rotation, and fast downloads.",
                badge: "Media",
              },
              {
                icon: "🎨",
                title: "Curated Themes",
                desc: "Seamlessly switch between crisp White, sleek Dark, and OLED Black modes on the fly.",
                badge: "Styling",
              },
              {
                icon: "🔒",
                title: "Encrypted Auth & Google OAuth",
                desc: "Secure authentication using verified JSON Web Tokens (JWT) and one-click Google OAuth sign-in.",
                badge: "Security",
              },
              {
                icon: "🟢",
                title: "Multi-Socket User Presence",
                desc: "Accurate real-time online/offline presence tracking that gracefully handles multi-tab browsing.",
                badge: "Presence",
              },
              {
                icon: "📁",
                title: "Documents, Code & Audio",
                desc: "Attach PDFs, spreadsheets, presentations, code snippets, and archive files up to 50MB with ease.",
                badge: "Files",
              },
            ].map(({ icon, title, desc, badge }) => (
              <motion.div
                key={title}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="card bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all text-left space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shadow-2xs">
                    {icon}
                  </div>
                  <span className="badge badge-neutral text-[10px] font-semibold">{badge}</span>
                </div>
                <h3 className="font-extrabold text-base text-base-content">{title}</h3>
                <p className="text-xs sm:text-sm text-base-content/65 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 Step Process) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-base-100 relative">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="badge badge-accent font-bold text-xs px-3 py-1 rounded-full">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start Chatting in 3 Simple Steps
            </h2>
            <p className="text-base-content/70 text-sm max-w-lg mx-auto">
              Get up and running in under 30 seconds with no complicated setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                step: "01",
                title: "Create Free Account",
                desc: "Sign up instantly with your email address or authenticate in one click via Google OAuth.",
                tag: "Sign Up",
              },
              {
                step: "02",
                title: "Connect with Contacts",
                desc: "Browse through registered friends with live green presence badges indicating who is currently online.",
                tag: "Discover",
              },
              {
                step: "03",
                title: "Share & Collaborate",
                desc: "Send instant messages, react with emojis, and share high-res photos and documents with zero lag.",
                tag: "Chat",
              },
            ].map(({ step, title, desc, tag }) => (
              <div
                key={step}
                className="card bg-base-200/70 p-6 rounded-3xl border border-base-300/80 shadow-sm hover:shadow-lg transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-2xl text-primary">{step}</span>
                  <span className="badge badge-primary/10 text-primary text-[10px] font-bold">
                    {tag}
                  </span>
                </div>
                <h3 className="font-bold text-base text-base-content">{title}</h3>
                <p className="text-xs sm:text-sm text-base-content/65 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-base-200/60 border-t border-base-300">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card bg-gradient-to-r from-primary via-accent to-secondary text-primary-content p-8 sm:p-12 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready for effortless real-time messaging?
              </h3>
              <p className="text-primary-content/85 text-xs sm:text-sm font-medium">
                Join Mingo today and experience seamless team communication.
              </p>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="btn bg-white text-primary hover:bg-white/90 border-0 btn-lg rounded-2xl font-extrabold px-8 shadow-xl whitespace-nowrap z-10 hover:scale-105 transition-transform"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-base-300 bg-base-100 py-10 px-4 sm:px-6 text-xs text-base-content/60">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary text-primary-content font-bold flex items-center justify-center text-base shadow-sm">
              💬
            </div>
            <div>
              <span className="font-black text-sm text-base-content tracking-tight">
                Mingo Chat
              </span>
              <p className="text-[10px] text-base-content/50">Modern Real-Time Messaging</p>
            </div>
          </div>

          <p>© {new Date().getFullYear()} Mingo Chat Application. All rights reserved.</p>

          <div className="flex items-center gap-5 font-semibold">
            <button
              onClick={() => navigate("/contact")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;