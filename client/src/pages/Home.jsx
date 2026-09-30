import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-base-200/60 overflow-x-hidden">
      {/* ORIGINAL TOP SECTION */}
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
        {/* Background Decorative Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 size-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 max-w-2xl mx-auto z-10"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs mb-6 border border-primary/20 shadow-2xs animate-float">
            <span>⚡</span>
            <span>Powered by Real-Time WebSockets</span>
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-base-content leading-tight">
            Connect instantly with{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Mingo
            </span>
          </h1>
          <p className="text-base-content/65 mt-4 text-base sm:text-xl max-w-lg mx-auto font-medium">
            Experience seamless real-time messaging, encrypted authentication, and customized themes for frictionless team communication.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-16 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <button
            className="btn btn-primary btn-md sm:btn-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 font-bold px-8 rounded-xl hover:scale-105 transition-all"
            onClick={() => navigate("/register")}
          >
            Get Started Free
          </button>
          <button
            className="btn btn-outline btn-md sm:btn-lg font-bold px-8 rounded-xl hover:bg-base-100/60"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            {
              icon: "⚡",
              title: "Instant Real-Time",
              desc: "Zero delay message delivery powered by bi-directional WebSocket channels.",
              badge: "Fast",
            },
            {
              icon: "🔒",
              title: "Secure Authentication",
              desc: "Protected using JWT cookies and verified Google OAuth authentication.",
              badge: "Encrypted",
            },
            {
              icon: "🎨",
              title: "Multi-Theme Experience",
              desc: "Switch between 8 handcrafted themes including Spotify, Claude, and Dark mode.",
              badge: "Customizable",
            },
          ].map(({ icon, title, desc, badge }) => (
            <div
              key={title}
              className="card bg-base-100/90 backdrop-blur-md shadow-lg border border-base-300/50 p-6 text-left hover:-translate-y-1.5 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <span className="badge badge-primary/10 text-primary text-[11px] font-semibold">
                  {badge}
                </span>
              </div>
              <h3 className="font-bold text-lg text-base-content leading-snug">{title}</h3>
              <p className="text-base-content/60 text-xs sm:text-sm mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* SINGLE ADDITIONAL SECTION BELOW (Animated on Scroll) */}
      <section className="py-24 px-4 bg-base-100/80 backdrop-blur-md border-t border-base-300/60 relative overflow-hidden">
        {/* Ambient background glow for the bottom section */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 size-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-14 text-center relative z-10">

          {/* Section Header with Scroll Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl mx-auto space-y-3"
          >
            <span className="badge badge-primary font-bold text-xs px-3.5 py-2 rounded-full shadow-sm">
              ✨ Experience Mingo
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-base-content">
              Simple, Powerful & Connected
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base font-medium">
              See how easy it is to set up your account and start communicating in seconds.
            </p>
          </motion.div>

          {/* 3 Step Process Cards with Staggered Scroll Animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                step: "01",
                title: "Sign Up Easily",
                desc: "Register with your email or log in instantly with your Google account in one click.",
                color: "bg-primary text-primary-content",
                borderGlow: "hover:border-primary/50",
              },
              {
                step: "02",
                title: "Find Your Friends",
                desc: "Search through active contacts, view real-time online status badges, and pick someone to chat with.",
                color: "bg-accent text-accent-content",
                borderGlow: "hover:border-accent/50",
              },
              {
                step: "03",
                title: "Chat & Customize",
                desc: "Enjoy instant WebSocket messaging, quick emoji responses, and custom theme styling.",
                color: "bg-secondary text-secondary-content",
                borderGlow: "hover:border-secondary/50",
              },
            ].map(({ step, title, desc, color, borderGlow }, idx) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`card bg-base-200/60 p-6 rounded-3xl border border-base-300/50 shadow-md hover:shadow-2xl ${borderGlow} transition-all duration-300 group`}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  className={`size-12 rounded-2xl ${color} font-black text-lg flex items-center justify-center mb-4 shadow-sm`}
                >
                  {step}
                </motion.div>
                <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-base-content/60 mt-2 leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action Banner with Entrance Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
            className="card bg-gradient-to-r from-primary via-accent to-secondary text-primary-content p-8 sm:p-12 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to join the conversation?</h3>
              <p className="text-primary-content/80 text-xs sm:text-sm font-medium">Create your free account today and start messaging.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/register")}
              className="btn bg-white text-primary border-none btn-md sm:btn-lg rounded-2xl font-bold px-8 shadow-lg hover:bg-white/90 whitespace-nowrap relative z-10"
            >
              Get Started Free
            </motion.button>
          </motion.div>

        </div>
      </section>
      {/* TWO PEOPLE CHATTING INTERACTIVE ANIMATION AT THE BOTTOM */}
      <section className="py-20 px-4 bg-base-200/80 border-t border-base-300/60 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 size-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10 text-center">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl mx-auto space-y-2.5"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-success/15 text-success font-extrabold text-xs border border-success/30 shadow-xs">
              <span className="size-2 rounded-full bg-success animate-ping" />
              <span>Live WebSocket Conversation</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-base-content">
              Experience Real-Time Chatting
            </h2>
            <p className="text-base-content/65 text-xs sm:text-sm font-medium">
              Zero lag, instantaneous delivery, and lively interactions between team members.
            </p>
          </motion.div>

          {/* Visual Interactive Chat Arena */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="card bg-base-100/90 backdrop-blur-xl p-5 sm:p-8 rounded-3xl border border-base-300/60 shadow-2xl space-y-6 relative overflow-hidden text-left"
          >
            {/* Top Interactive Status Bar between 2 Avatars */}
            <div className="flex items-center justify-between border-b border-base-200/80 pb-4">
              {/* Person 1: Alex */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="size-11 sm:size-12 rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-content font-black text-lg flex items-center justify-center shadow-md">
                    👨‍💻
                  </div>
                  <span className="absolute -bottom-1 -right-1 size-3.5 bg-success rounded-full ring-2 ring-base-100 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-base-content leading-tight">Alex Rivera</h4>
                  <span className="text-[10px] text-success font-bold flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-success inline-block" /> Online
                  </span>
                </div>
              </motion.div>

              {/* WebSocket Live Connection Pulse */}
              <div className="hidden sm:flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="size-2.5 rounded-full bg-primary shadow-xs"
                  />
                  <div className="w-20 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-full" />
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                    className="size-2.5 rounded-full bg-secondary shadow-xs"
                  />
                </div>
                <span className="text-[9px] font-extrabold text-base-content/45 uppercase tracking-wider">
                  Live Socket Stream
                </span>
              </div>

              {/* Person 2: Maya */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="flex items-center gap-3 flex-row-reverse"
              >
                <div className="relative">
                  <div className="size-11 sm:size-12 rounded-2xl bg-gradient-to-tr from-secondary to-accent text-secondary-content font-black text-lg flex items-center justify-center shadow-md">
                    👩‍💼
                  </div>
                  <span className="absolute -bottom-1 -left-1 size-3.5 bg-success rounded-full ring-2 ring-base-100 animate-pulse" />
                </div>
                <div className="text-right">
                  <h4 className="font-extrabold text-xs sm:text-sm text-base-content leading-tight">Maya Chen</h4>
                  <span className="text-[10px] text-success font-bold flex items-center justify-end gap-1">
                    <span className="size-1.5 rounded-full bg-success inline-block" /> Online
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Conversation Messages Flow */}
            <div className="space-y-4 py-2">
              {/* Message 1: Alex */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-end gap-2.5 justify-start"
              >
                <div className="size-7 rounded-xl bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  👨‍💻
                </div>
                <div className="bg-base-200/80 p-3.5 rounded-2xl rounded-bl-xs border border-base-300/80 shadow-xs max-w-[85%] sm:max-w-[70%] space-y-1">
                  <p className="text-[11px] font-bold text-primary">Alex Rivera</p>
                  <p className="text-xs sm:text-sm text-base-content font-medium leading-relaxed">
                    Hey Maya! Have you tried the new real-time chat features on Mingo? ⚡
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-base-content/40">
                    <span>10:42 AM</span>
                  </div>
                </div>
              </motion.div>

              {/* Message 2: Maya */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-end gap-2.5 justify-end"
              >
                <div className="bg-primary text-primary-content p-3.5 rounded-2xl rounded-br-xs shadow-md max-w-[85%] sm:max-w-[70%] space-y-1">
                  <p className="text-[11px] font-bold text-primary-content/85 text-left">Maya Chen</p>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-left">
                    Yes! The messages send with zero lag and switching themes on the fly is super smooth! ✨🔥
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-primary-content/75">
                    <span>10:42 AM</span>
                    <span className="font-bold">✓✓</span>
                  </div>
                </div>
                <div className="size-7 rounded-xl bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center shrink-0">
                  👩‍💼
                </div>
              </motion.div>

              {/* Message 3: Alex */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex items-end gap-2.5 justify-start"
              >
                <div className="size-7 rounded-xl bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  👨‍💻
                </div>
                <div className="bg-base-200/80 p-3.5 rounded-2xl rounded-bl-xs border border-base-300/80 shadow-xs max-w-[85%] sm:max-w-[70%] space-y-1">
                  <p className="text-[11px] font-bold text-primary">Alex Rivera</p>
                  <p className="text-xs sm:text-sm text-base-content font-medium leading-relaxed">
                    Awesome! Let's get the whole engineering team onboarded right away! 🚀🎉
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-base-content/40 pt-1">
                    <span className="inline-flex gap-1 text-xs">🚀 👏 💯</span>
                    <span>10:43 AM</span>
                  </div>
                </div>
              </motion.div>

              {/* Live Animated Typing Indicator for Maya */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.3 }}
                className="flex items-center gap-2 justify-end pr-9"
              >
                <span className="text-[11px] text-base-content/50 font-medium">Maya is typing</span>
                <div className="flex items-center gap-1 bg-base-200/80 px-2.5 py-1.5 rounded-full border border-base-300 shadow-xs">
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="size-1.5 rounded-full bg-primary"
                  />
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="size-1.5 rounded-full bg-accent"
                  />
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="size-1.5 rounded-full bg-secondary"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-base-300 bg-base-100 py-8 px-4 text-center text-xs text-base-content/60">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary text-primary-content font-bold flex items-center justify-center">
              💬
            </div>
            <span className="font-extrabold text-sm text-base-content">Mingo Chat</span>
          </div>

          <p>© {new Date().getFullYear()} Mingo Chat Application. All rights reserved.</p>

          <div className="flex items-center gap-4 font-semibold">
            <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">
              Contact Us
            </button>
            <button onClick={() => navigate("/register")} className="hover:text-primary transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;