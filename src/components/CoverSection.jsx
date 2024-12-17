const CoverSection = () => {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center 
        bg-gradient-to-b from-blue-500 to-blue-900 text-white animate-fadeIn"
    >
      {/* App Title */}
      <h1 className="text-5xl md:text-6xl font-semibold italic animate-pulse">
        Tele<span className="font-bold">Spectrom</span>
      </h1>

      {/* Tagline */}
      <p className="mt-4 text-lg md:text-xl text-center">
        Guarding Your Chats, Defeating <br /> Scams with AI Power
      </p>

      {/* Loading Animation */}
      <div className="mt-6">
        <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default CoverSection;
