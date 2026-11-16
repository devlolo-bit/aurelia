import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { AppImage } from '@/components/ui/app-image';
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

export default function Home() {
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
      <section className="relative flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-primary text-primary-foreground">
        <AppImage
          slot="hero-main"
          prompt="minimalist fashion editorial, quiet evergreen studio with garments on a rack, soft natural light, muted oat and charcoal palette, plain backdrop, no logos, no text, no close-up faces"
          alt="Editorial de moda sazonal da Aurelia"
          className="absolute inset-0 opacity-70"
        />
        <div className="absolute inset-0 bg-primary/35" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32 sm:pb-24">
          <p className="text-xs uppercase tracking-[0.28em] text-primary-foreground/75">
            Aurelia · roupa pensada
          </p>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
            Feito para durar.
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Peças atemporais, materiais rastreáveis e um jeito mais lento de se vestir.
          </p>
          <div className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary-foreground/65">
            <ArrowDown className="size-4" /> Ver a coleção
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-8 border-b border-border pb-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-foreground">Coleções sazonais</p>
              {loading ? (
                <Skeleton className="mt-4 h-12 w-72" />
              ) : (
                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {current?.name || 'Uma estação pensada'}
                </h2>
              )}
            </div>
            {current && (
              <Button asChild variant="outline" className="w-fit rounded-full">
                <Link to={`/collections/${current.id}`}>
                  Ver coleção <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </Button>
            )}
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

      <section className="bg-primary py-20 text-primary-foreground sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Sparkles className="size-5 text-primary-foreground/70" />
            <h2 className="mt-5 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
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
