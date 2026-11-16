import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";
import { toast as sonnerToast } from "sonner";

/**
 * Toaster — the notifications' host (already mounted by the platform inside the <FabProvider>, no need to add it).
 * To fire one, import `toast` from this module: `import { toast } from '@/components/ui/sonner'` →
 * `toast.success('Salvo!')`, `toast.error('Falhou')`, `toast('Mensagem')`.
 */
function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      theme="light"
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-lg border border-border bg-card text-card-foreground shadow-lg text-[12.5px] font-medium",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, sonnerToast as toast };
