import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, SlidersHorizontal } from 'lucide-react';
import { collection } from '@/lib/fab-client';
import type { Row } from '@/lib/fab-client';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RichText, formatMoney, formatDate } from '@/lib/fab-client';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/reveal';

type CollectionRecord = Row & {
  name: string;
  season?: string;
  year?: number;
  tagline?: string;
  description?: string;
  cover?: string;
  palette?: string;
};

type PieceRecord = Row & {
  name: string;
  collection: string;
  collection__label?: string;
  category: string;
  summary?: string;
  material?: string;
  photo?: string;
  price?: number;
  sort_order?: number;
};

const categories = ['All', 'Casacos', 'Tricô', 'Camisaria', 'Jeans', 'Calças', 'Acessórios'];

function PieceCard({ piece, index }: { piece: PieceRecord; index: number }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <AppImage
          slot={`collection-piece-${piece.id || index}`}
          prompt="minimalist fashion editorial garment, soft natural light, muted palette, plain backdrop, clothing on a rack or still-life composition, no logos, no text, no close-up face"
          src={piece.photo}
          alt={`${piece.name}, minimalist fashion editorial`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-primary/70 to-transparent p-5 pt-16 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-xs uppercase tracking-[0.18em] text-primary-foreground">Ver peça</span>
          <ArrowUpRight className="size-4 text-primary-foreground" />
        </div>
      </div>
      <div className="border-b border-border/70 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium tracking-tight">{piece.name}</h2>
            {piece.summary && <p className="mt-1 text-sm text-muted-foreground">{piece.summary}</p>}
          </div>
          {typeof piece.price === 'number' && (
            <span className="shrink-0 text-sm text-muted-foreground">{formatMoney(piece.price)}</span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <span>{piece.category}</span>
          {piece.material && (
            <>
              <span aria-hidden="true">·</span>
              <span>{piece.material}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const [season, setSeason] = useState<CollectionRecord | null>(null);
  const [pieces, setPieces] = useState<PieceRecord[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    Promise.all([
      collection<CollectionRecord>('collection').get(id),
      collection<PieceRecord>('piece').list({ filter: { collection: id }, sort: 'sort_order', limit: 50 }),
    ])
      .then(([nextSeason, nextPieces]) => {
        setSeason(nextSeason);
        setPieces(nextPieces);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const visiblePieces = useMemo(
    () => (category === 'All' ? pieces : pieces.filter((piece) => piece.category === category)),
    [category, pieces]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <Skeleton className="mb-10 h-5 w-32" />
        <Skeleton className="aspect-[16/8] w-full" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="aspect-[4/5] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !season) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-start justify-center px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Coleção não encontrada</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Esta coleção não está mais disponível.</h1>
        <Button asChild variant="outline" className="mt-8 rounded-full">
          <Link to="/collections">
            <ArrowLeft className="mr-2 size-4" /> Voltar às coleções
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 sm:pb-24 sm:pt-14">
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Todas as coleções
        </Link>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <AppImage
              slot={`collection-cover-${season.id}`}
              prompt="minimalist fashion editorial collection cover, soft natural light, muted evergreen and bone palette, garments on a rack, plain architectural backdrop, no logos, no text, no close-up faces"
              src={season.cover}
              alt={`${season.name} collection cover`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="pb-1">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              {season.season} · {season.year}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-tight text-balance sm:text-6xl">
              {season.name}
            </h1>
            {season.tagline && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{season.tagline}</p>}
            {season.description && (
              <div className="mt-7 text-sm leading-7 text-muted-foreground">
                <RichText html={season.description} />
              </div>
            )}
            {season.palette && (
              <div className="mt-8 border-t border-border pt-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Paleta</p>
                <p className="mt-2 text-sm">{season.palette}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-6 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">A seleção</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Peças da coleção</h2>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <SlidersHorizontal className="size-4" /> Filtrar
            </div>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-6" aria-label="Filtrar peças por categoria">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.13em] transition-colors',
                  category === item
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary hover:text-primary'
                )}
              >
                {category === item && <Check className="size-3.5" />}
                {item}
              </button>
            ))}
          </div>
          {visiblePieces.length === 0 ? (
            <div className="border-y border-border py-20 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma peça nesta categoria ainda.</p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePieces.map((piece, index) => (
                <Reveal key={piece.id} delay={Math.min(index, 6) * 60}>
                  <PieceCard piece={piece} index={index} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Aurelia / {season.name}</p>
        <p className="mt-4 text-sm text-muted-foreground">Feita com materiais rastreáveis, projetada para durar mais.</p>
      </section>
    </div>
  );
}
