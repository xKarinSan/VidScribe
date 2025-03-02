import { useState } from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface Toast extends ToastProps {
  id: string;
  visible: boolean;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = 'default', duration = 3000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration,
      visible: true,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );

      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, 300); // Animation duration
    }, duration);
  };

  return { toast, toasts };
}