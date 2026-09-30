import React from "react";

const ContactUs = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200/50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        {/* Info Panel */}
        <div className="flex flex-col justify-center gap-6">
          <div>
            <div className="inline-flex size-14 rounded-2xl bg-gradient-to-tr from-primary to-accent items-center justify-center text-2xl text-primary-content shadow-lg shadow-primary/20 mb-3 animate-float">
              📬
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-base-content">Get in Touch</h1>
            <p className="text-base-content/60 mt-2 text-base sm:text-lg font-medium">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "📧", label: "Email", value: "support@mingo.chat" },
              { icon: "📞", label: "Phone", value: "+91 98765 43210" },
              { icon: "📍", label: "Location", value: "Bengaluru, India" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-3 rounded-2xl bg-base-100/60 border border-base-300/40">
                <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0 font-bold">
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">{label}</p>
                  <p className="text-base-content font-bold text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="card bg-base-100/90 backdrop-blur-md shadow-xl border border-base-300/60 rounded-3xl">
          <div className="card-body gap-4 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-base-content tracking-tight">Send a Message</h2>

            <div className="space-y-1">
              <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Your Name</label>
              <input type="text" placeholder="John Doe" className="input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Email Address</label>
              <input type="email" placeholder="you@example.com" className="input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Subject</label>
              <input type="text" placeholder="How can we help?" className="input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Message</label>
              <textarea
                className="textarea textarea-bordered w-full text-sm rounded-xl resize-none focus:outline-none focus:border-primary"
                rows={4}
                placeholder="Tell us more..."
              />
            </div>

            <button className="btn btn-primary w-full mt-2 rounded-xl font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;