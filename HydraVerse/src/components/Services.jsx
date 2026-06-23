import servicesBanner from '../assets/services_banner.png';

export const Services = () => {
  return (
    <section id="services" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide">Our Services</h2>
      </div>

      {/* Services Banner Container */}
      <div className="relative">
        {/* VR Banner Image */}
        <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl relative border border-[#8176af]/30">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src={servicesBanner}
            alt="Virtual Reality"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlapping Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 px-4 md:px-10 -mt-16 md:-mt-24 relative z-20">

          {/* Card 1 */}
          <div className="bg-[#211e38] border border-[#8176af] rounded-3xl p-8 pt-12 shadow-2xl text-center flex flex-col justify-between items-center relative min-h-[280px]">
            {/* Floating Brand Gradient Icon */}
            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#8176af] to-[#c0b7e8] text-[#302c42] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-[#8176af]/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3">VR Game Development</h3>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                High-immersive VR game design and full-cycle development tailored for modern headsets and engines.
              </p>
            </div>
            <div className="mt-6">
              <a href="#" className="text-xs font-extrabold tracking-widest text-[#c0b7e8] border-b-2 border-[#c0b7e8] pb-1 hover:text-white hover:border-white transition-colors uppercase">
                More
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#211e38] border border-[#8176af] rounded-3xl p-8 pt-12 shadow-2xl text-center flex flex-col justify-between items-center relative min-h-[280px]">
            {/* Floating Brand Gradient Icon */}
            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#8176af] to-[#c0b7e8] text-[#302c42] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-[#8176af]/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3">VR Training & Simulation</h3>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                Interactive virtual training environments and simulations designed for enterprise safety and scalability.
              </p>
            </div>
            <div className="mt-6">
              <a href="#" className="text-xs font-extrabold tracking-widest text-[#c0b7e8] border-b-2 border-[#c0b7e8] pb-1 hover:text-white hover:border-white transition-colors uppercase">
                More
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#211e38] border border-[#8176af] rounded-3xl p-8 pt-12 shadow-2xl text-center flex flex-col justify-between items-center relative min-h-[280px]">
            {/* Floating Brand Gradient Icon */}
            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#8176af] to-[#c0b7e8] text-[#302c42] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-[#8176af]/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3">VR Software Consulting</h3>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                Strategic tech stack planning, system integration, and consultation for immersive software architectures.
              </p>
            </div>
            <div className="mt-6">
              <a href="#" className="text-xs font-extrabold tracking-widest text-[#c0b7e8] border-b-2 border-[#c0b7e8] pb-1 hover:text-white hover:border-white transition-colors uppercase">
                More
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;

