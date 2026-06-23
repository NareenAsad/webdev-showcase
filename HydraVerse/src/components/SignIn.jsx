import { useState } from 'react';
import { Link } from 'react-router-dom';

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#1e1b32] py-12 px-4">
      <div className="max-w-5xl w-full bg-[#211e38] rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#8176af]/50 relative">

        {/* Left Side: Welcome Panel with Spheres */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1e1b32] to-[#302c42] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden min-h-[350px] border-b md:border-b-0 md:border-r border-[#8176af]/30">

          {/* Decorative Spheres using Brand Gradients */}
          <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-gradient-to-br from-[#8176af]/20 to-transparent blur-sm"></div>
          <div className="absolute -bottom-20 -left-10 w-52 h-52 rounded-full bg-gradient-to-tr from-[#c0b7e8]/10 to-[#8176af]/20 blur-md"></div>
          <div className="absolute right-10 bottom-10 w-36 h-36 rounded-full bg-gradient-to-br from-[#8176af]/30 to-[#c0b7e8]/20 shadow-xl"></div>

          {/* Content */}
          <div className="relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-black tracking-wide leading-tight">
              WELCOME
            </h1>
            <h2 className="text-lg md:text-xl font-bold text-[#c0b7e8] tracking-widest mt-2 uppercase">
              HYDRA
            </h2>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed mt-6 max-w-sm font-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#211e38]/95 relative z-10 text-white">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Sign in</h2>
          <p className="text-gray-400 text-xs mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

            {/* Username Input Container */}
            <div className="bg-[#1e1b32] border border-[#8176af] rounded-2xl flex items-center px-4 py-3 gap-3 focus-within:border-[#c0b7e8] focus-within:ring-1 focus-within:ring-[#c0b7e8] transition-all">
              <svg className="w-5 h-5 text-[#c0b7e8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                placeholder="User Name"
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
              />
            </div>

            {/* Password Input Container */}
            <div className="bg-[#1e1b32] border border-[#8176af] rounded-2xl flex items-center px-4 py-3 gap-3 focus-within:border-[#c0b7e8] focus-within:ring-1 focus-within:ring-[#c0b7e8] transition-all">
              <svg className="w-5 h-5 text-[#c0b7e8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#c0b7e8] hover:text-white text-xs font-bold tracking-wider uppercase transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-[#8176af] bg-[#1e1b32] text-[#8176af] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-[#c0b7e8] hover:text-white transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 text-[#302c42] text-xs font-bold tracking-widest bg-gradient-to-r from-[#8176af] to-[#c0b7e8] rounded-2xl hover:opacity-90 transition-opacity uppercase"
              >
                Sign in
              </button>
            </div>

            {/* OR Separator */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-[#8176af]/30"></div>
              <span className="px-4 text-[10px] text-gray-400 uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-[#8176af]/30"></div>
            </div>

            {/* Sign In With Other Button */}
            <div>
              <button
                type="button"
                className="w-full py-3.5 text-white text-xs font-bold tracking-widest border border-[#8176af] rounded-2xl hover:bg-[#8176af]/10 transition-colors uppercase"
              >
                Sign in with other
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-xs text-gray-400 pt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#c0b7e8] font-bold hover:text-white transition-colors">
                Sign Up
              </Link>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};

export default SignIn;

