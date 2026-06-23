const Card = ({ title, body }) => {
    return (
        <div className="flex flex-col justify-between max-w-sm p-8 bg-[#211e38] rounded-[40px] shadow-2xl relative overflow-hidden group">
            {/* Soft glow effect behind the card on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8176af]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[40px]"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <h5 className="mb-4 text-2xl font-bold tracking-tight text-white capitalize line-clamp-2">
                {title}
              </h5>
              <p className="mb-8 font-light text-gray-400 leading-relaxed line-clamp-4">
                {body}
              </p>
              
              <div className="mt-auto">
                <a href="#" className="inline-flex justify-center w-full items-center px-6 py-3.5 text-xs font-bold tracking-widest text-[#302c42] bg-gradient-to-r from-[#8176af] to-[#c0b7e8] rounded-full hover:opacity-90 transition-opacity">
                    READ ARTICLE
                    <svg className="w-4 h-4 ml-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="#302c42" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                </a>
              </div>
            </div>
        </div>
    );
};

export default Card;
