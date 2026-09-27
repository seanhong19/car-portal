import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="toast-container">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast-item toast-${toast.type}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="toast-icon">
                            {toast.type === "success" && "✓"}
                            {toast.type === "error" && "x"}
                            {toast.type === "info" && "i"}
                        </span>
                        <span className="toast-message">{toast.message}</span>
                        <button type="button" className="toast-close" aria-label="Close">
                            x
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}


export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
