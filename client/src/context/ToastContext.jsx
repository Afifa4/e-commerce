/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from "react";
import { X } from "lucide-react";

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const lastToastRef = useRef({ message: "", time: 0 });

    const showToast = useCallback((message, type = "info") => {
        const now = Date.now();

        // Prevent duplicate toasts within 500ms
        if (lastToastRef.current.message === message && now - lastToastRef.current.time < 500) {
            return;
        }

        lastToastRef.current = { message, time: now };

        const id = now;
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    function removeToast(id) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl min-w-[280px] max-w-[400px]
              animate-slide-in backdrop-blur-md border
              ${toast.type === "error" ? "bg-red-500/90 border-red-400 text-white" : ""}
              ${toast.type === "success" ? "bg-green-500/90 border-green-400 text-white" : ""}
              ${toast.type === "warning" ? "bg-yellow-500/90 border-yellow-400 text-black" : ""}
              ${toast.type === "info" ? "bg-[#333]/95 border-[#444] text-white" : ""}
            `}
                    >
                        <span className="flex-1 text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="opacity-70 hover:opacity-100 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
