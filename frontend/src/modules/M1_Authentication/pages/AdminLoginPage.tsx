export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Panel - Royal Blue Decorative Card with Car Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#133585] relative items-center justify-center p-10 overflow-hidden">
        {/* Top-left subtle branding */}
        <div className="absolute top-6 left-8 text-white/90 font-bold text-lg tracking-wide">
          Auto Care
        </div>

        {/* Curved Image Frame */}
        <div className="relative w-full max-w-xl aspect-[4/3] rounded-tl-[160px] rounded-tr-[140px] rounded-br-[160px] rounded-bl-[60px] border-[6px] border-white overflow-hidden shadow-2xl bg-slate-800">
          <img
            src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80"
            alt="Sports Car Showcase"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Panel - Login Form Skeleton */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              Manage your service system seamlessly
            </p>
          </div>

          {/* Form Skeleton */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
            noValidate
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-slate-900 mb-2"
              >
                Email
              </label>
              <div className="relative flex items-center rounded-xl bg-gradient-to-r from-[#3b5998] via-[#8b9278] to-[#f3d35a] shadow-sm">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-3.5 pl-4 pr-12 text-sm text-white placeholder-white/75 focus:outline-none rounded-xl"
                />
                <span className="absolute right-4 text-slate-900 font-bold text-lg select-none">
                  @
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-slate-900 mb-2"
              >
                Password
              </label>
              <div className="relative flex items-center rounded-xl bg-gradient-to-r from-[#3b5998] via-[#8b9278] to-[#f3d35a] shadow-sm">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  className="w-full bg-transparent py-3.5 pl-4 pr-12 text-sm text-white placeholder-white/75 focus:outline-none rounded-xl"
                />
                {/* Lock Icon SVG */}
                <span className="absolute right-4 text-slate-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#133585] focus:ring-[#133585]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="text-slate-400 hover:text-[#133585] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="w-3/4 bg-[#18347c] hover:bg-[#122860] text-white font-semibold text-lg py-3 rounded-xl shadow-md transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="h-[1px] w-28 bg-slate-700" />
              <span className="text-xs font-medium text-slate-400 uppercase">
                OR
              </span>
              <div className="h-[1px] w-28 bg-slate-700" />
            </div>

            {/* Social Sign-In Buttons (Placeholder UI) */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 bg-[#18347c] hover:bg-[#122860] text-white text-xs sm:text-sm font-medium py-2.5 px-4 rounded-xl shadow-sm transition-colors"
              >
                <span className="font-bold text-base bg-white text-[#18347c] rounded-full w-5 h-5 flex items-center justify-center">
                  G
                </span>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2.5 bg-[#18347c] hover:bg-[#122860] text-white text-xs sm:text-sm font-medium py-2.5 px-4 rounded-xl shadow-sm transition-colors"
              >
                <span className="font-bold text-base bg-[#1877F2] text-white rounded-full w-5 h-5 flex items-center justify-center pt-1 pr-0.5">
                  f
                </span>
                <span>Facebook</span>
              </button>
            </div>

            {/* Bottom Sign Up Prompt */}
            <div className="text-center pt-4 text-xs sm:text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-semibold text-slate-900 hover:underline"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}