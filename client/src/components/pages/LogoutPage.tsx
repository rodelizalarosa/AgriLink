import React from 'react';
import { LogOut, AlertTriangle, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LogoutPageProps {
    onLogout: () => void;
}

const LogoutPage: React.FC<LogoutPageProps> = ({ onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[10000] bg-white flex items-center justify-center p-6 animate-in fade-in duration-500">
            {/* Background Accent */}
            <div className="absolute inset-0 bg-gray-50/50 -z-10" />
            
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-50 to-transparent opacity-50" />

            <div className="w-full max-w-xl flex flex-col items-center text-center space-y-12">
                {/* 🛡️ Branding / Context */}
                <div className="flex items-center gap-3 text-gray-400 bg-white px-6 py-2.5 rounded-full border border-gray-100 shadow-sm animate-in slide-in-from-top-8 duration-700">
                    <LogOut className="w-5 h-5 text-[#5ba409]" />
                    <span className="font-black uppercase tracking-[0.3em] text-[10px] italic">AgriLink Merchant Portal</span>
                </div>

                {/* ⚠️ Visual Anchor */}
                <div className="relative group animate-in zoom-in-95 duration-700">
                    <div className="absolute inset-0 bg-red-100 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-red-500 shadow-2xl shadow-red-900/10 border border-red-50 relative z-10 transition-transform hover:scale-105 duration-500">
                        <AlertTriangle className="w-14 h-14" />
                    </div>
                </div>

                {/* 📝 Messaging */}
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Confirming <br /> <span className="text-red-600">Sign-Out</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm italic uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                        Are you sure you want to end your session? You'll need to re-authenticate to manage your harvests and orders.
                    </p>
                </div>

                {/* 🎯 Elite Control Panel */}
                <div className="w-full grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <button
                        onClick={() => {
                            onLogout();
                        }}
                        className="group relative overflow-hidden bg-red-600 hover:bg-red-700 text-white p-5 rounded-3xl font-black uppercase tracking-[0.2em] italic text-xs shadow-xl shadow-red-900/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Confirm Logout
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 p-5 rounded-3xl font-black uppercase tracking-[0.2em] italic text-xs transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Portal
                    </button>
                </div>

                {/* Footer Tip */}
                <div className="pt-8 flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest animate-in fade-in duration-1000 delay-500">
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    Securely logs out from all browser tabs
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default LogoutPage;
