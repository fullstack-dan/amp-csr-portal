import { createContext, useContext, useState, useCallback } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const Alert = ({ alert, onClose, inModal = false }) => {
    const statusClasses = {
        success: "bg-green-700",
        error: "bg-red-700",
        warning: "bg-yellow-500",
        info: "bg-blue-950",
    };

    if (!alert.open) return null;

    return (
        <div
            className={`
                fixed ${
                    inModal ? "top-1/2" : "top-8"
                } left-1/2 transform -translate-x-1/2 min-w-[300px]
                px-6 py-4
                ${statusClasses[alert.status] || statusClasses.info}
                text-white rounded shadow-lg z-[9999] text-base flex items-center gap-3
                cursor-pointer
                transition-opacity duration-300 opacity-100
                animate-fade-in
            `}
            onClick={onClose}
            style={{ animation: "fade-in 0.1s" }}
        >
            <span>{alert.message}</span>
            <button
                className="ml-auto bg-transparent border-none text-white text-lg cursor-pointer"
                onClick={onClose}
                aria-label="Close"
                type="button"
            >
                &times;
            </button>
            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        status: "info", // 'success', 'error', 'warning', 'info'
    });

    const [timeoutId, setTimeoutId] = useState(null);

    const showAlert = useCallback(
        (message, status = "info", timeout = 3000) => {
            setAlert({ open: true, message, status });

            if (timeoutId) clearTimeout(timeoutId);

            const id = setTimeout(() => {
                setAlert((prev) => ({ ...prev, open: false }));
            }, timeout);

            setTimeoutId(id);
        },
        [timeoutId]
    );

    const handleClose = () => {
        setAlert((prev) => ({ ...prev, open: false }));
        if (timeoutId) clearTimeout(timeoutId);
    };

    return (
        <AlertContext.Provider value={{ showAlert, alert, handleClose }}>
            {children}
            {alert.open && <Alert alert={alert} onClose={handleClose} />}
        </AlertContext.Provider>
    );
};
