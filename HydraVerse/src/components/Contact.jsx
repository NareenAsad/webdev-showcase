export const Contact = () => {
  return (
    <section
      id="contact"
      className="relative py-20 px-4 md:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1600&auto=format&fit=crop')`
      }}
    >
      {/* Dark overlay to ensure readability */}
      <div className="absolute inset-0 bg-[#12111c]/90"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-white">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-wide">Contact Us</h2>
          <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-12 lg:gap-20">

          {/* Left Column: Contact details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8">

            {/* Address */}
            <div className="flex items-start">
              <div className="w-14 h-14 bg-[#1e1b32] border border-[#8176af] rounded-full flex items-center justify-center text-[#c0b7e8] text-xl shadow-md shrink-0 mr-6">
                <svg className="w-6 h-6 text-[#c0b7e8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#c0b7e8] mb-1">Address</h4>
                <p className="text-gray-300 text-sm md:text-base whitespace-pre-line leading-relaxed">
                  4671 Sugar Camp Road,
                  Owatonna, Minnesota,
                  55060
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start">
              <div className="w-14 h-14 bg-[#1e1b32] border border-[#8176af] rounded-full flex items-center justify-center text-[#c0b7e8] text-xl shadow-md shrink-0 mr-6">
                <svg className="w-6 h-6 text-[#c0b7e8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#c0b7e8] mb-1">Phone</h4>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  507-475-60945-6094
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start">
              <div className="w-14 h-14 bg-[#1e1b32] border border-[#8176af] rounded-full flex items-center justify-center text-[#c0b7e8] text-xl shadow-md shrink-0 mr-6">
                <svg className="w-6 h-6 text-[#c0b7e8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#c0b7e8] mb-1">Email</h4>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed break-all">
                  wrub7d78i0e@temporary-mail.net
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Dark glass-morphic form card */}
          <div className="w-full lg:w-1/2 bg-[#211e38]/90 border border-[#8176af] rounded-[40px] p-8 md:p-12 shadow-2xl text-white">
            <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-white">Send Message</h3>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full py-2 border-b border-[#8176af] focus:border-[#c0b7e8] bg-transparent text-white placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full py-2 border-b border-[#8176af] focus:border-[#c0b7e8] bg-transparent text-white placeholder-gray-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  placeholder="Type your Message..."
                  className="w-full py-2 border-b border-[#8176af] focus:border-[#c0b7e8] bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none transition-colors"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="text-[#302c42] text-xs font-bold tracking-widest bg-gradient-to-r from-[#8176af] to-[#c0b7e8] rounded-full px-10 py-4 hover:opacity-90 transition-opacity uppercase"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;


