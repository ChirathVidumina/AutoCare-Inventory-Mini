import { useState } from "react";

export default function VideoAssistancePage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="p-6 h-full min-h-[85vh] flex flex-col font-sans">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Video Assistance</h1>
          <p className="text-slate-500 text-sm mt-1">Provide real-time support to customers on the road</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold text-slate-700">System Online</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Left Panel - Incoming Queue */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Support Queue (Mock)</h2>

          <div className="flex-1 space-y-3">
            {/* Queue Item */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800">Kamal Perera</h3>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">URGENT</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">Vehicle breakdown (Engine overheating) at Galle Road.</p>

              {!isCallActive ? (
                <button
                  onClick={() => setIsCallActive(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm"
                >
                  Accept & Connect
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-300 text-slate-500 font-medium py-2 rounded-lg text-sm cursor-not-allowed"
                >
                  Call in Progress...
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 opacity-60">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800">Nimal Silva</h3>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">WAITING</span>
              </div>
              <p className="text-sm text-slate-500">Flat tire assistance requested.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Video Call Interface */}
        <div className="w-full lg:w-2/3 bg-slate-900 rounded-2xl shadow-lg relative overflow-hidden flex flex-col min-h-[400px]">
          {!isCallActive ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">Select a customer from the queue to start</p>
            </div>
          ) : (
            <>
              {/* Remote Video (Customer View - Placeholder Image) */}
              <div className="absolute inset-0 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80"
                  alt="Customer Camera"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              {/* Local Video (Admin/Mechanic View - PIP) */}
              <div className="absolute top-6 right-6 w-32 md:w-48 aspect-video bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-400 shadow-lg">
                 {isVideoOff ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 text-xs">Camera Off</div>
                 ) : (
                    <div className="w-full h-full bg-slate-600 flex items-center justify-center text-slate-300 font-medium text-sm">
                      Admin Camera
                    </div>
                 )}
              </div>

              {/* Status Overlay */}
              <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-md text-white text-xs font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                02:14
              </div>

              {/* Call Controls */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full shadow-lg transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-white text-slate-800 hover:bg-slate-200'}`}
                >
                  {isMuted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  )}
                </button>

                <button
                  onClick={() => setIsCallActive(false)}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2.586-2.586A2 2 0 0017.172 2H6.828a2 2 0 00-1.414.586L2.828 5.172A2 2 0 002 6.586V19a2 2 0 002 2h16a2 2 0 002-2v-3.343a2 2 0 00-.586-1.414L19 11.657M16 8l-4 4m0 0l-4-4m4 4v7" />
                  </svg>
                </button>

                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-full shadow-lg transition-colors ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white text-slate-800 hover:bg-slate-200'}`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}