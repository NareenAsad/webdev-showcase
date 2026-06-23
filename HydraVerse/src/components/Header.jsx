import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${targetId}`;
    }
  };

  return (
    <nav className="bg-[#1e1b32] py-6 px-4 sm:px-8 relative z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C16 10 10 16 0 20C10 24 16 30 20 40C24 30 30 24 40 20C30 16 24 10 20 0Z" fill="#c0b7e8" />
          </svg>
          <span className="self-center text-3xl font-light tracking-[0.2em] whitespace-nowrap text-white uppercase">Hydra</span>
        </a>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg lg:hidden hover:bg-[#302c42] focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          )}
        </button>

        {/* Desktop Menu Links */}
        <div className="hidden lg:block w-full lg:w-auto" id="navbar-default">
          <ul className="font-bold text-xs uppercase tracking-widest flex flex-col lg:flex-row p-4 lg:p-0 mt-4 lg:space-x-12 rtl:space-x-reverse lg:mt-0 text-white animate-fade-in">
            <li><a href="#about" onClick={(e) => handleScrollClick(e, 'about')} className="hover:text-[#c0b7e8] transition-colors">About</a></li>
            <li><a href="#articles" onClick={(e) => handleScrollClick(e, 'articles')} className="hover:text-[#c0b7e8] transition-colors">Articles</a></li>
            <li><a href="#services" onClick={(e) => handleScrollClick(e, 'services')} className="hover:text-[#c0b7e8] transition-colors">Services</a></li>
            <li><a href="#community" onClick={(e) => handleScrollClick(e, 'community')} className="hover:text-[#c0b7e8] transition-colors">Our Community</a></li>
          </ul>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center space-x-6">
          <a
            href="#contact"
            onClick={(e) => handleScrollClick(e, 'contact')}
            className="text-white text-xs font-bold tracking-widest border-2 border-white rounded-full px-8 py-3 hover:bg-white hover:text-[#1e1b32] transition-colors"
          >
            CONTACT US
          </a>
          <Link to="/signin" className="text-[#302c42] text-xs font-bold tracking-widest bg-gradient-to-r from-[#8176af] to-[#c0b7e8] rounded-full px-8 py-3.5 hover:opacity-90 transition-opacity">
            JOIN HYDRA
          </Link>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="w-full lg:hidden mt-4 bg-[#211e38] rounded-2xl border border-[#302c42] p-6 absolute top-20 left-0 right-0 mx-4 shadow-xl z-50 animate-slide-down">
            <ul className="font-bold text-sm uppercase tracking-widest flex flex-col space-y-6 text-white mb-8">
              <li><a href="#about" onClick={(e) => handleScrollClick(e, 'about')} className="block py-2 hover:text-[#c0b7e8] transition-colors">About</a></li>
              <li><a href="#services" onClick={(e) => handleScrollClick(e, 'services')} className="block py-2 hover:text-[#c0b7e8] transition-colors">Services</a></li>
              <li><a href="#articles" onClick={(e) => handleScrollClick(e, 'articles')} className="block py-2 hover:text-[#c0b7e8] transition-colors">Latest Articles</a></li>
              <li><a href="#community" onClick={(e) => handleScrollClick(e, 'community')} className="block py-2 hover:text-[#c0b7e8] transition-colors">Our Community</a></li>
            </ul>
            <div className="flex flex-col space-y-4">
              <a
                href="#contact"
                onClick={(e) => handleScrollClick(e, 'contact')}
                className="text-center text-white text-xs font-bold tracking-widest border-2 border-white rounded-full py-3.5 hover:bg-white hover:text-[#1e1b32] transition-colors"
              >
                CONTACT US
              </a>
              <Link to="/signin" onClick={() => setIsOpen(false)} className="text-center text-[#302c42] text-xs font-bold tracking-widest bg-gradient-to-r from-[#8176af] to-[#c0b7e8] rounded-full py-4 hover:opacity-90 transition-opacity">
                JOIN HYDRA
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;

