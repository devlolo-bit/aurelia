import * as React from "react";
import { cn } from "@/lib/utils";

// A ELEVAÇÃO do card. O `shadow-sm` do Tailwind é UMA sombra de contato a 5% — some contra qualquer fundo claro,
// e é o que faz um card branco sobre cinza claro parecer um retângulo desenhado em vez de uma superfície. Uma
// sombra que lê como profundidade tem duas camadas: contato (curta) + ambiente (larga e suave). E em azul-ardósia
// (16,24,40), não preto puro: preto sobre fundo claro acinzenta a superfície.

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-2xl border border-border/60 py-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-12px_rgba(16,24,40,0.12)]", className)} {...props} />;
}
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 px-6", className)} {...props} />;
}
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-display font-bold leading-none", className)} {...props} />;
}
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-muted-foreground text-sm", className)} {...props} />;
}
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6", className)} {...props} />;
}
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center px-6", className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
