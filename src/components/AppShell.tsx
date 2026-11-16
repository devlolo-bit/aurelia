import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Logo } from '@/lib/fab-client';
import { amitseLogo, amitseIcon } from '@/lib/amitse-images';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/#sobre', label: 'Sobre' },
  { to: '/#como-funciona', label: 'Como funciona' },
  { to: '/#aplicacao', label: 'Aplicação' },
];

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav className={cn(mobile ? 'flex flex-col gap-5' : 'hidden items-center gap-7 md:flex')}>
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn('text-sm transition-colors', isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" aria-label="Âmitse início">
            <img src={amitseLogo} alt="Âmitse" className="h-9 w-auto object-contain" />
          </Link>
          <Navigation />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <Logo className="h-7" variant="wordmark" name="Aurelia" />
                </SheetTitle>
              </SheetHeader>
              <div className="px-6 py-8">
                <Navigation mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-[#090079] py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <img src={amitseIcon} alt="Âmitse" className="h-14 w-auto object-contain" />
            <p className="mt-3 max-w-xs text-sm opacity-75">Mulheres arquitetando a própria autonomia.</p>
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            <Link to="/privacidade" className="opacity-80 transition-opacity hover:opacity-100">
              Política de privacidade
            </Link>
            {/* PENDENTE: contato oficial */}
            <span className="opacity-60">Contato a definir</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
