import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Welcome to PollyGlot
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          Your AI-powered translation companion. Perfect translation, every
          time.
        </p>
        <Link
          to="/translator"
          className="inline-flex items-center gap-2 bg-[#035A9D] hover:bg-[#034a85] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          🦜 Start Translating
        </Link>
      </div>
    </div>
  );
};

export default Index;
