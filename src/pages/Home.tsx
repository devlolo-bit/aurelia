import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { AppImage } from '@/components/ui/app-image';
import { amitseHero } from '@/lib/amitse-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@/components/ui/icon';
import { collection, formatMoney, RichText } from '@/lib/fab-client';
import { toast } from '@/components/ui/sonner';
import { Reveal } from '@/components/ui/reveal';

type CollectionRecord = {
  id: string;
  name: string;
  season?: string;
  year?: number;
  tagline?: string;
  description?: string;
  cover?: string;
  palette?: string;
};

type Piece = {
  id: string;
  name: string;
  collection: string;
  summary?: string;
  material?: string;
  photo?: string;
  price?: number;
  category?: string;
};

type Pillar = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  metric?: string;
};

const emailSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.'),
});

function PieceCard({ piece, index }: { piece: Piece; index: number }) {
  return (
    <Link to={`/collections/${piece.collection}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <AppImage
          slot={`home-piece-${piece.id || index}`}
          prompt="minimalist fashion editorial, a single garment on a wooden rack, soft natural light, muted evergreen and oat palette, plain backdrop, no logos, no text, no close-up face"
          src={piece.photo}
          alt={piece.name}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="border-b border-border py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium tracking-tight transition-colors group-hover:text-primary">{piece.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{piece.summary || piece.material}</p>
          </div>
          {piece.price !== undefined && (
            <span className="shrink-0 text-sm text-muted-foreground">{formatMoney(piece.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function EssentialTile({ piece, index }: { piece: Piece; index: number }) {
  return (
    <Link
      to={`/collections/${piece.collection}`}
      className="group relative block aspect-[4/5] overflow-hidden bg-muted"
    >
      <AppImage
        slot={`home-essential-${piece.id || index}`}
        prompt="minimalist fashion editorial still life of a timeless wardrobe essential, soft natural light, muted palette, plain backdrop, no logos, no text, no close-up face"
        src={piece.photo}
        alt={piece.name}
        className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 via-primary/45 to-transparent p-5 pt-20 text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.2em] opacity-75">Essencial</p>
        <h3 className="mt-2 text-lg font-medium">{piece.name}</h3>
        <p className="mt-1 text-sm opacity-80">{piece.summary || piece.material}</p>
      </div>
    </Link>
  );
}

function AppCta({ className = '' }: { className?: string }) {
  const [pulse, setPulse] = useState(false);
  const [hover, setHover] = useState(false);
  const on = pulse || hover;
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function pulseCta(event: { preventDefault: () => void }) {
    event.preventDefault();
    setPulse(true);
    window.setTimeout(() => {
      setPulse(false);
      document.getElementById('aplicacao')?.scrollIntoView({ behavior: 'smooth' });
    }, 900);
  }
  return (
    <Button
      asChild
      size="lg"
      onClick={pulseCta}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: on ? '#69FF01' : '#1200E2',
        color: on ? '#1200E2' : '#FFFFFF',
        animation: on && !reduceMotion ? 'amitse-zoom 0.9s ease-in-out' : undefined,
      }}
      className={`rounded-full px-8 transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1a3f] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
    >
      <a href="#aplicacao" className="inline-flex items-center gap-[11px]">
        <ArrowDown /> Faça a sua Aplicação
      </a>
    </Button>
  );
}

export default function Home() {

  const [heroScroll, setHeroScroll] = useState(0);
  const heroViewH = typeof window !== 'undefined' ? window.innerHeight - 64 : 800;
  const heroImgH = (typeof window !== 'undefined' ? window.innerWidth : 1280) * (2 / 3);
  const heroMaxOffset = Math.max(0, heroImgH - heroViewH);
  const heroOffset = Math.min(heroScroll * 0.5, heroMaxOffset);
  useEffect(() => {
    const onScroll = () => setHeroScroll(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [current, setCurrent] = useState<CollectionRecord | null>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [essentials, setEssentials] = useState<Piece[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [collections, pillarRows] = await Promise.all([
          collection<CollectionRecord>('collection').list({
            filter: { is_current: true },
            sort: '-created_at',
            limit: 1,
          }),
          collection<Pillar>('pillar').list({ sort: 'sort_order', limit: 6 }),
        ]);
        const active = collections[0] || null;
        setCurrent(active);
        setPillars(pillarRows);
        if (active) {
          const [seasonal, essentialRows] = await Promise.all([
            collection<Piece>('piece').list({ filter: { collection: active.id }, sort: 'sort_order', limit: 3 }),
            collection<Piece>('piece').list({ filter: { is_essential: true }, sort: 'sort_order', limit: 3 }),
          ]);
          setPieces(seasonal);
          setEssentials(essentialRows);
        }
      } catch {
        toast.error('Não foi possível carregar a coleção. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const description = useMemo(() => current?.description || '', [current]);

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message || 'Informe um e-mail válido.');
      return;
    }
    setEmailError('');
    setSubmitting(true);
    try {
      await collection('subscriber').create({ email: result.data.email, created_at: new Date().toISOString() });
      setSubscribed(true);
      setEmail('');
    } catch {
      toast.error('Algo deu errado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section
        className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden text-white"
        style={{ backgroundColor: '#0b1a3f' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={amitseHero}
            alt="Mulher de terno azul-marinho em um escritório sereno"
            className="absolute left-0 top-0 h-auto w-full max-w-none will-change-transform"
            style={{ transform: `translate3d(0, ${-heroOffset}px, 0)` }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(11,26,63,0.92) 0%, rgba(11,26,63,0.5) 45%, rgba(11,26,63,0.15) 100%)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(11,26,63,0.95) 0%, rgba(11,26,63,0) 40%)' }}
          />
        </div>
        <div className="relative mx-auto w-full max-w-[1280px] px-6 py-28 md:px-10 min-[1200px]:px-20">
          <div className="max-w-[600px] min-[768px]:max-w-[500px] min-[1200px]:max-w-[600px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 min-[768px]:text-[13px] min-[768px]:tracking-[0.22em] min-[1200px]:text-[14px] min-[1200px]:tracking-[0.24em]">
              Mulher, você merece viver com mais
            </p>
            <h1 className="mt-4 text-balance text-[clamp(46px,13vw,56px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white min-[768px]:mt-5 min-[768px]:text-[clamp(68px,8.5vw,80px)] min-[1200px]:whitespace-nowrap min-[1200px]:text-[clamp(88px,7.5vw,112px)]">
              Autonomia.
            </h1>
            <span aria-hidden="true" className="mt-6 block h-[3px] w-12 rounded-full bg-[#a4ff0e] min-[768px]:mt-7 min-[768px]:w-14 min-[1200px]:w-16" />
            <p className="mt-6 text-[18px] font-normal leading-[1.45] text-white/90 min-[768px]:mt-7 min-[768px]:max-w-[460px] min-[768px]:text-[20px] min-[1200px]:max-w-[520px] min-[1200px]:text-[22px]">
              Afinal, seu maior poder é bancar as suas escolhas!
            </p>
            <div className="mt-8 min-[768px]:mt-9 min-[1200px]:mt-10">
              <AppCta className="h-[54px] w-full justify-center text-[16px] font-semibold min-[768px]:w-auto min-[768px]:px-7 min-[1200px]:text-[17px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-8 border-b border-border pb-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-foreground">O caminho para bancar as suas próprias escolhas é</p>
              {loading ? (
                <Skeleton className="mt-4 h-12 w-72" />
              ) : (
                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Arquitetar a sua autonomia
                </h2>
              )}
            </div>
            <AppCta className="w-fit" />
          </div>
          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <Skeleton className="aspect-[4/5]" />
              <Skeleton className="aspect-[4/5]" />
              <Skeleton className="aspect-[4/5]" />
            </div>
          ) : current ? (
            <>
              <div className="mt-8 max-w-2xl text-muted-foreground">
                <RichText html={description} />
              </div>
              <div className="mt-10 grid gap-x-6 sm:grid-cols-3">
                {pieces.map((piece, index) => (
                  <Reveal key={piece.id} delay={Math.min(index, 6) * 60}>
                    <PieceCard piece={piece} index={index} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-10 text-muted-foreground">A próxima coleção está tomando forma.</p>
          )}
        </div>
      </section>

      <section className="bg-muted py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-foreground">Os essenciais</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Além da estação.</h2>
            </div>
            <Link
              to="/essentials"
              className="hidden text-sm font-medium text-foreground transition-colors hover:text-primary sm:flex sm:items-center sm:gap-2"
            >
              Ver todos <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {essentials.map((piece, index) => (
              <Reveal key={piece.id} delay={Math.min(index, 6) * 60}>
                <EssentialTile piece={piece} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Nossos compromissos</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Nada escondido no processo.</h2>
          </div>
          <div className="mt-14 grid gap-0 sm:grid-cols-3">
            {pillars.slice(0, 3).map((pillar, index) => (
              <div key={pillar.id} className={`border-t border-border py-7 sm:px-6 ${index === 0 ? 'sm:pl-0' : ''}`}>
                <Icon name={pillar.icon || 'Circle'} className="size-5 text-primary" />
                <p className="mt-8 text-3xl font-medium tracking-tight text-primary">{pillar.metric}</p>
                <h3 className="mt-3 text-lg font-medium">{pillar.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="aplicacao" className="bg-[#090079] py-20 text-white sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
              Um guarda-roupa mais quieto, no seu e-mail.
            </h2>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Receba antes os novos lançamentos e as notas do ateliê.
            </p>
          </div>
          <div className="w-full max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-3 border-b border-primary-foreground/40 pb-3 text-sm">
                <Check className="size-4" /> Pronto, você está na lista. Obrigado.
              </div>
            ) : (
              <form onSubmit={subscribe} noValidate>
                <Field error={emailError}>
                  <div className="flex items-center gap-3 border-b border-primary-foreground/40 pb-2">
                    <Mail className="size-4 shrink-0 text-primary-foreground/60" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Seu e-mail"
                      aria-label="Seu e-mail"
                      className="border-0 bg-transparent px-0 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0"
                    />
                    <Button type="submit" variant="secondary" disabled={submitting} className="shrink-0 rounded-full">
                      {submitting ? 'Assinando…' : 'Assinar'}
                    </Button>
                  </div>
                </Field>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
