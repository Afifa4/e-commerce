/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmContext = createContext();

export function useConfirm() {
    return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [resolveRef, setResolveRef] = useState(null);

    function confirm(msg) {
        setMessage(msg);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolveRef(() => resolve);
        });
    }

    function handleConfirm() {
        setIsOpen(false);
        resolveRef?.(true);
    }

    function handleCancel() {
        setIsOpen(false);
        resolveRef?.(false);
    }

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Confirm Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Modal */}
                    <div className="relative bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-scale-in">
                        {/* Close Button */}
                        <button
                            onClick={handleCancel}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        {/* Icon */}
                        <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-400" size={28} />
                        </div>

                        {/* Message */}
                        <h3 className="text-white text-lg font-bold text-center mb-2">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-400 text-center text-sm mb-6">
                            {message}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 rounded-xl border border-[#333] text-gray-400 hover:text-white hover:border-white transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-bold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}
