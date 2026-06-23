import vrWoman from '../assets/vr_woman.png';

const Hero = () => {
  return (
    <section id="about" className="bg-transparent py-16 px-4 sm:px-8 relative overflow-hidden">
      {/* Background SVG decorative lines could go here, but omitted for simplicity */}

      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">

        {/* Left Side: Text Content */}
        <div className="lg:w-1/2 text-left pr-0 lg:pr-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8176af] to-[#c0b7e8]">Dive</span> Into The Depths<br />
            Of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8176af] to-[#c0b7e8]">Virtual Reality</span>
          </h1>
          <p className="text-gray-400 font-light text-sm md:text-base mb-10 max-w-lg leading-loose">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore nisl tincidunt eget. Lectus mauris eros in vitae.
          </p>
          <div className="flex items-center space-x-6">
            <a href="/signin" className="text-[#302c42] text-xs font-bold tracking-widest bg-gradient-to-r from-[#8176af] to-[#c0b7e8] rounded-full px-10 py-4 hover:opacity-90 transition-opacity">
              BUILD YOUR WORLD
            </a>
            {/* Arrow right */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#c0b7e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="lg:w-1/2 mt-16 lg:mt-0 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px]">
            {/* Outer dark border (Offset to bottom left) */}
            <div className="absolute inset-0 bg-transparent border-[12px] border-[#302c42] z-0 transform translate-x-4 translate-y-4" style={{ borderRadius: '100px 100px 100px 300px' }}></div>
            {/* The Image */}
            <img
              src={vrWoman}
              alt="Virtual Reality"
              className="relative z-10 w-full h-auto object-cover"
              style={{ borderRadius: '100px 100px 100px 300px' }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
