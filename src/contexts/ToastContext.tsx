import React, { createContext, useContext, useRef, useState } from 'react';
import Toast, { ToastType } from '../components/common/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: ToastType = 'info') => {
    // Cancelar el anterior si aún está visible
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setToast({ visible: true, message, type });

    // Cerrar automáticamente tras 1.5 segundos
    timeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 1500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={1500}
          onHide={() => {
            setToast((prev) => ({ ...prev, visible: false }));
            timeoutRef.current = null;
          }}
        />
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
};
