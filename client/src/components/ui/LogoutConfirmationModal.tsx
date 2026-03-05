import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import Modal from './Modal';

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3 text-red-600">
                    <LogOut className="w-5 h-5" />
                    <span>Session Termination</span>
                </div>
            }
            maxWidth="max-w-md"
        >
            <div className="space-y-8 py-4">
                {/* ⚠️ Alert Section */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 shadow-inner">
                        <AlertTriangle className="w-10 h-10 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">Are you sure?</h3>
                        <p className="text-sm font-medium text-gray-400 mt-2 max-w-[280px]">
                            You're about to end your current session. You'll need to re-authenticate to manage your harvests.
                        </p>
                    </div>
                </div>

                {/* 🎯 Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-4 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic text-[12px] shadow-xl shadow-red-900/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <LogOut className="w-4 h-4" />
                        Confirm Logout
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-2xl font-black uppercase tracking-[0.2em] italic text-[11px] transition-all hover:bg-gray-100 flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LogoutConfirmationModal;
