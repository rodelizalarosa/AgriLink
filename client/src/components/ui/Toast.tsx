import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Leaf } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

// Simple event-based notification system
class NotificationService {
    private listeners: ((toast: ToastMessage) => void)[] = [];

    subscribe(listener: (toast: ToastMessage) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify(type: ToastType, message: string) {
        console.log(`[Toast] Notifying: ${type} - ${message}`);
        const id = Math.random().toString(36).substring(2, 9);
        this.listeners.forEach(listener => listener({ id, type, message }));
    }
}

export const notificationService = new NotificationService();

export const useToast = () => {
    const toast = useCallback((type: ToastType, message: string) => {
        notificationService.notify(type, message);
    }, []);

    return {
        success: (msg: string) => toast('success', msg),
        error: (msg: string) => toast('error', msg),
        info: (msg: string) => toast('info', msg),
    };
};

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        return notificationService.subscribe((toast) => {
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 5000);
        });
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            pointer-events-auto
            flex items-center gap-4 min-w-[320px] max-w-[400px] p-5 pr-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border
            animate-in slide-in-from-right-6 duration-400 ease-out
            ${toast.type === 'success' ? 'bg-white border-[#5ba409]/30' :
                        toast.type === 'error' ? 'bg-white border-red-200' :
                            'bg-white border-[#5ba409]/30'}
          `}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-[#5ba409]/10 text-[#5ba409]' :
                        toast.type === 'error' ? 'bg-red-50 text-red-500' :
                            'bg-green-50 text-[#5ba409]'
                        }`}>
                        {toast.type === 'success' && <Leaf className="w-5 h-5" />}
                        {toast.type === 'error' && <XCircle className="w-5 h-5" />}
                        {toast.type === 'info' && <Leaf className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-center gap-1.5 mb-1 opacity-60">
                            <span className={`text-[9px] font-black uppercase tracking-widest italic ${toast.type === 'success' ? 'text-[#5ba409]' :
                                toast.type === 'error' ? 'text-red-500' : 'text-[#5ba409]'
                                }`}>
                                {toast.type === 'success' ? 'Confirmed' : toast.type === 'error' ? 'Alert' : 'Notice'}
                            </span>
                        </div>
                        <p className="font-black text-[14px] italic uppercase tracking-tight text-gray-900 leading-tight">
                            {toast.message}
                        </p>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100/80 rounded-lg transition-all active:scale-90 text-gray-400 hover:text-gray-600 shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
