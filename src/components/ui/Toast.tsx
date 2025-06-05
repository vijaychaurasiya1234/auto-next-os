import React, { useState, useEffect, createContext, useContext } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

// Types
type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

// Context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Provider
export const ToastProvider: React.FC<{ children: React.ReactNode, position?: ToastPosition }> = ({ 
  children, 
  position = 'top-right' 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastPosition, setToastPosition] = useState<ToastPosition>(position);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast = { ...toast, id };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => {
      const updatedToasts = prevToasts.filter((toast) => toast.id !== id);
      const toastToRemove = prevToasts.find((toast) => toast.id === id);
      
      if (toastToRemove?.onClose) {
        toastToRemove.onClose();
      }
      
      return updatedToasts;
    });
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    position: toastPosition,
    setPosition: setToastPosition,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return {
    toasts: context.toasts,
    toast: (props: Omit<Toast, 'id'>) => context.addToast(props),
    dismiss: (id: string) => context.removeToast(id),
  };
};

// Toast
interface ToastProps extends Toast {
  onClose: () => void;
}

const getVariantStyles = (variant: ToastVariant): string => {
  switch (variant) {
    case 'success':
      return 'bg-success-50 border-success-200 text-success-800';
    case 'error':
      return 'bg-error-50 border-error-200 text-error-800';
    case 'warning':
      return 'bg-warning-50 border-warning-200 text-warning-800';
    case 'info':
      return 'bg-primary-50 border-primary-200 text-primary-800';
    default:
      return 'bg-white border-neutral-200 text-neutral-800';
  }
};

const getPositionStyles = (position: ToastPosition): string => {
  switch (position) {
    case 'top-left':
      return 'top-0 left-0';
    case 'top-center':
      return 'top-0 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-0 right-0';
    case 'bottom-left':
      return 'bottom-0 left-0';
    case 'bottom-center':
      return 'bottom-0 left-1/2 -translate-x-1/2';
    case 'bottom-right':
      return 'bottom-0 right-0';
    default:
      return 'top-0 right-0';
  }
};

export const ToastItem: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  onClose,
}) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'pointer-events-auto flex w-full max-w-md rounded-lg border shadow-lg',
        getVariantStyles(variant)
      )}
    >
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium">{title}</p>
            {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="ml-4 inline-flex text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
          >
            <span className="sr-only">Close</span>
            <X size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Toaster
export const Toaster: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Create context provider if not in component tree
  const [ToastProviderWrapper, setToastProviderWrapper] = useState<React.ReactNode | null>(null);
  
  useEffect(() => {
    try {
      useToast();
    } catch (e) {
      setToastProviderWrapper(<ToastProvider>{null}</ToastProvider>);
    }
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  const ToastContainer = () => {
    const { toasts, removeToast, position } = useContext(ToastContext)!;
    
    return createPortal(
      <div
        className={cn(
          'fixed z-50 flex flex-col gap-2 p-4 w-full md:max-w-[420px]',
          getPositionStyles(position)
        )}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              id={toast.id}
              title={toast.title}
              description={toast.description}
              variant={toast.variant}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>,
      document.body
    );
  };
  
  if (ToastProviderWrapper) {
    return (
      <>
        {ToastProviderWrapper}
        <ToastContainer />
      </>
    );
  }
  
  try {
    useToast();
    return <ToastContainer />;
  } catch (e) {
    return null;
  }
};