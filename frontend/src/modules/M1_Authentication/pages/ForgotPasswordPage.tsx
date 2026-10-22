import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const hasMinLength = newPassword.length >= 8;
  const hasSymbolOrNumber = /[\d!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const noEmailMatch = email && newPassword ? !newPassword.includes(email.split('@')[0]) : true;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep((prev) => prev + 1);
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1); 
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col relative">
        
        {step < 4 && (
          <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-100">
            <button 
              onClick={() => step === 1 ? navigate("/login") : setStep(step - 1)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-slate-900">
              {step === 3 ? "New Password" : "Forgot Password"}
            </h1>
          </div>
        )}

        <div className="flex-1 px-8 py-10 flex flex-col">
          
          {step === 1 && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center mb-8">
                {/* මෙතනට තමයි අපි අලුත් රූපය එකතු කළේ */}
                <div className="w-64 h-64 flex items-center justify-center mb-4">
                  <img
                    src="/forgot password.png"
                    alt="Forgot Password"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-slate-600 font-medium text-center">
                  Please write your email address to receive confirmation code
                </p>
              </div>

              <form onSubmit={handleNextStep} className="mt-auto space-y-4">
                <div>
                  <div className="border border-slate-300 rounded-xl p-1 bg-white focus-within:border-[#133585] focus-within:ring-1 focus-within:ring-[#133585] transition-all">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail address"
                      disabled={isLoading}
                      className="w-full bg-transparent py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-[#18347c] hover:bg-[#122860] text-white font-semibold text-sm py-4 rounded-xl shadow-md transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Sending..." : "Confirm E-mail"}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center mb-8">
                <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-6xl">📱</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Verify E-mail Address</h2>
                <p className="text-sm text-slate-500 text-center">
                  Verification code send to <span className="font-semibold text-slate-800">{email}</span>
                </p>
              </div>

              <form onSubmit={handleNextStep} className="mt-auto space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-center text-xl font-bold text-slate-900 border border-slate-300 rounded-xl focus:border-[#133585] focus:ring-1 focus:ring-[#133585] outline-none transition-all"
                    />
                  ))}
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length < 4}
                  className="w-full bg-[#18347c] hover:bg-[#122860] text-white font-semibold text-sm py-4 rounded-xl shadow-md transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Verifying..." : "Confirm code"}
                </button>

                <p className="text-center text-xs text-slate-500 font-medium">
                  00.25 Renew confirmation code
                </p>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Create Your New Password</h2>
                <p className="text-sm text-slate-500">Your new password must be different from previous</p>
              </div>

              <form onSubmit={handleNextStep} className="mt-auto space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="border border-slate-300 rounded-xl p-1 bg-white focus-within:border-[#133585] flex items-center">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent py-3 px-4 text-sm text-slate-900 focus:outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="pr-4 text-slate-400 hover:text-[#18347c] transition-colors focus:outline-none"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <div className="border border-slate-300 rounded-xl p-1 bg-white focus-within:border-[#133585] flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="password"
                      className="w-full bg-transparent py-3 px-4 text-sm text-slate-900 focus:outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="pr-4 text-slate-400 hover:text-[#18347c] transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 pb-4">
                  <div className={`flex items-center gap-2 text-xs font-medium ${noEmailMatch && newPassword ? 'text-green-600' : 'text-slate-500'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Must not contain your email
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-medium ${hasMinLength ? 'text-green-600' : 'text-slate-500'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-medium ${hasSymbolOrNumber ? 'text-green-600' : 'text-slate-500'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Contains a symbol or a number
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !newPassword || newPassword !== confirmPassword || !hasMinLength || !hasSymbolOrNumber || !noEmailMatch}
                  className="w-full bg-[#18347c] hover:bg-[#122860] text-white font-semibold text-sm py-4 rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Confirm Password"}
                </button>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-[#18347c] rounded-full flex items-center justify-center mb-8 shadow-lg shadow-blue-900/20">
                <div className="w-12 h-12 bg-[#2ba3ff] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Changed</h2>
              <p className="text-sm text-slate-500 mb-12">
                Your password has been changed successfully
              </p>
              
              <button
                onClick={() => navigate("/login")}
                className="w-full max-w-xs bg-[#18347c] hover:bg-[#122860] text-white font-semibold text-sm py-4 rounded-xl shadow-md transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}