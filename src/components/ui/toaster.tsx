import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end p-4 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={cn(
            'bg-background border shadow-lg rounded-lg p-4 transition-all duration-300 transform',
            toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
            toast.variant === 'destructive' && 'border-destructive text-destructive'
          )}
          style={{ maxWidth: '350px' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && (
                <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => {
                document.getElementById(`toast-${toast.id}`)?.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => {
                  document.getElementById(`toast-${toast.id}`)?.remove();
                }, 300);
              }}
              className="ml-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}