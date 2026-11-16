import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, formatMoney, type Row } from '@/lib/fab-client';
import { Reveal } from '@/components/ui/reveal';

type Piece = Row & {
  name: string;
  category: string;
  summary?: string;
  material?: string;
  photo?: string;
  price?: number;
  is_essential?: boolean;
  sort_order?: number;
};

const categoryOrder = ['Casacos', 'Tricô', 'Camisaria', 'Jeans', 'Calças', 'Acessórios'];

function PieceCard({ piece }: { piece: Piece }) {
  return (
    <Card className="group overflow-hidden rounded-xl border-0 bg-card pt-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <AppImage
          slot={`essential-${piece.id}`}
          prompt={`minimalist fashion editorial photograph of ${piece.name}, soft natural light, muted palette, plain backdrop, garment on a rack or still-life composition, no logos, no text, no close-up face`}
          src={piece.photo}
          alt={`${piece.name}, ${piece.category}`}
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4">
          <Badge variant="secondary" className="bg-background/90 text-xs font-normal backdrop-blur-sm">
            Essencial
          </Badge>
        </div>
      </div>
      <CardContent className="space-y-3 px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium tracking-tight">{piece.name}</h2>
            {piece.summary && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{piece.summary}</p>}
          </div>
          {typeof piece.price === 'number' && (
            <span className="shrink-0 text-sm text-muted-foreground">{formatMoney(piece.price)}</span>
          )}
        </div>
        {piece.material && (
          <p className="border-t border-border pt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {piece.material}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Essentials() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    collection<Piece>('piece')
      .list({ filter: { is_essential: true }, sort: 'sort_order', limit: 100 })
      .then((rows) => {
        if (active) setPieces(rows);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const groups = useMemo(() => {
    const grouped = new Map<string, Piece[]>();
    pieces.forEach((piece) => {
      const current = grouped.get(piece.category) ?? [];
      grouped.set(piece.category, [...current, piece]);
    });
    return categoryOrder
      .filter((category) => grouped.has(category))
      .map((category) => ({
        category,
        pieces: grouped.get(category) ?? [],
      }));
  }, [pieces]);

  return (
    <div>
      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-primary">O guarda-roupa permanente</p>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Essenciais, sempre em uso.
            </h1>
            <p className="max-w-sm text-base leading-7 text-muted-foreground">
              As peças que atravessam a estação. Feitas com materiais pensados, acabadas para o uso diário e desenhadas para ficarem mais suas com o tempo.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-medium">O guarda-roupa está demorando um instante.</p>
            <p className="mt-2 text-sm text-muted-foreground">Recarregue e tente de novo.</p>
          </div>
        )}

        {!loading && !error && pieces.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="Nenhum essencial ainda"
            description="O guarda-roupa permanente aparecerá aqui conforme as peças forem adicionadas."
            action={
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-foreground"
              >
                Ver coleções <ArrowUpRight className="size-4" />
              </Link>
            }
          />
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="space-y-16 sm:space-y-20">
            {groups.map((group) => (
              <section key={group.category} aria-labelledby={`category-${group.category}`}>
                <div className="mb-7 flex items-center gap-4">
                  <h2
                    id={`category-${group.category}`}
                    className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground"
                  >
                    {group.category}
                  </h2>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">
                    {group.pieces.length} {group.pieces.length === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {group.pieces.map((piece, index) => (
                    <Reveal key={piece.id} delay={Math.min(index, 6) * 60}>
                      <PieceCard piece={piece} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
