import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { userRole, logout } = useAuth();

  return (
    <div className="p-6 md:p-10 w-full max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 flex flex-col md:flex-row items-center gap-6 bg-slate-50 border-b border-slate-200">
          <div className="w-24 h-24 bg-[#133585] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
            A
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800">Admin User</h2>
            <p className="text-slate-500 font-medium">admin@autocare.com</p>
            <div className="mt-3 inline-block px-4 py-1 bg-blue-100 text-[#133585] text-xs font-bold rounded-full uppercase tracking-widest">
              Role: {userRole || "GUEST"}
            </div>
          </div>
        </div>

        {/* Settings & Permissions Concept */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Security Settings */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security Settings
            </h3>
            <ul className="space-y-3 text-sm font-medium text-slate-600">
              <li className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                <span>Change Password</span>
                <span className="text-slate-400">→</span>
              </li>
              <li className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                <span>Two-Factor Authentication (2FA)</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Enabled</span>
              </li>
            </ul>
          </div>

          {/* RBAC Permissions Display */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              System Access
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {userRole === "ADMIN" ? (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Manage Staff & Mechanics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> System Settings & Reports
                  </li>
                </>
              ) : (
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> General Dashboard Access
                </li>
              )}
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> WebRTC Live Video Support
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              logout();
              alert("Mock Logout Triggered! In real app, this clears token and redirects to /login.");
            }}
            className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold text-sm rounded-xl transition-colors shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}