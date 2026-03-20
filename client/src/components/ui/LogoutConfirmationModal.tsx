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
            title="ARE YOU SURE?"
            maxWidth="max-w-md"
        >
            <div className="space-y-8 py-6">
                {/* ⚠️ Alert Section */}
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-[#5ba409] shadow-inner mb-2">
                        <LogOut className="w-12 h-12" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 max-w-[280px]">
                            Are you sure you want to log out? You will need to sign in again to access your harvests and management tools.
                        </p>
                    </div>
                </div>

                {/* 🎯 Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic text-[12px] shadow-lg shadow-red-600/10 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3"
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
