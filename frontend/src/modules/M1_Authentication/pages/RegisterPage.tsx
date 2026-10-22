import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);

    // Mock API Request (1.5 seconds delay)
    setTimeout(() => {
      // Mock Success State -> Redirect to Login
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 sm:px-12 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#133585] mb-2">
              Auto Care
            </h1>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Create Account
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Manage your service system seamlessly
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">Name</label>
              <div className="rounded-xl bg-gradient-to-r from-[#3b5998] via-[#8b9278] to-[#f3d35a] p-[1px]">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isLoading}
                  className="w-full bg-slate-800 py-3 pl-4 pr-4 text-sm text-white placeholder-white/50 focus:outline-none rounded-xl disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">Email</label>
              <div className="rounded-xl bg-gradient-to-r from-[#3b5998] via-[#8b9278] to-[#f3d35a] p-[1px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="w-full bg-slate-800 py-3 pl-4 pr-4 text-sm text-white placeholder-white/50 focus:outline-none rounded-xl disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">Password</label>
              <div className="relative rounded-xl bg-gradient-to-r from-[#3b5998] via-[#8b9278] to-[#f3d35a] p-[1px]">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isLoading}
                  className="w-full bg-slate-800 py-3 pl-4 pr-10 text-sm text-white placeholder-white/50 focus:outline-none rounded-xl disabled:opacity-50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </span>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">Confirm Password</label>
              <div className="relative rounded-xl bg-gradient-to-r from-[#3b5998] via-[#8b9278] to-[#f3d35a] p-[1px]">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  disabled={isLoading}
                  className="w-full bg-slate-800 py-3 pl-4 pr-10 text-sm text-white placeholder-white/50 focus:outline-none rounded-xl disabled:opacity-50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </span>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 text-xs text-slate-500 pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#133585] focus:ring-[#133585]"
              />
              <label>
                I agree to the <span className="font-semibold text-slate-700 cursor-pointer">Terms of Service</span> and <span className="font-semibold text-slate-700 cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            {/* Create Account Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#18347c] hover:bg-[#122860] text-white font-semibold text-base py-3 rounded-xl shadow-md transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center justify-center gap-4 py-1">
              <div className="h-[1px] w-28 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400 uppercase">OR</span>
              <div className="h-[1px] w-28 bg-slate-200" />
            </div>

            {/* Social Sign-In Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" disabled={isLoading} className="flex items-center justify-center gap-2.5 bg-[#18347c] hover:bg-[#122860] text-white text-xs font-medium py-2.5 px-4 rounded-xl shadow-sm transition-colors disabled:opacity-50">
                <span className="font-bold text-sm bg-white text-[#18347c] rounded-full w-5 h-5 flex items-center justify-center">G</span>
                <span>Google</span>
              </button>
              <button type="button" disabled={isLoading} className="flex items-center justify-center gap-2.5 bg-[#18347c] hover:bg-[#122860] text-white text-xs font-medium py-2.5 px-4 rounded-xl shadow-sm transition-colors disabled:opacity-50">
                <span className="font-bold text-sm bg-[#1877F2] text-white rounded-full w-5 h-5 flex items-center justify-center">f</span>
                <span>Facebook</span>
              </button>
            </div>

            {/* Sign In Prompt */}
            <div className="text-center pt-2 text-xs sm:text-sm text-slate-500">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="font-semibold text-slate-900 hover:underline">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Royal Blue Decorative Card with Mechanic Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#133585] relative items-center justify-center p-10 overflow-hidden">
        {/* Curved Image Frame matching Figma */}
        <div className="relative w-full max-w-xl aspect-[4/3] rounded-tl-[160px] rounded-tr-[60px] rounded-br-[160px] rounded-bl-[140px] border-[6px] border-white overflow-hidden shadow-2xl bg-slate-800">
          <img
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80"
            alt="Mechanic working on car"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}