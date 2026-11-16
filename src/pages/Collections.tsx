import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Layers3 } from 'lucide-react';
import { collection } from '@/lib/fab-client';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
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
  is_current?: boolean;
};

function CollectionCard({ item, index }: { item: CollectionRecord; index: number }) {
  const prompt = `${item.season || 'seasonal'} minimalist fashion editorial collection, garments on a rack, soft natural light, muted evergreen, bone and copper palette, plain backdrop, no logos, no text, no close-up faces`;

  return (
    <article className="group">
      <Link
        to={`/collections/${item.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <AppImage
            slot={`collection-${item.id || index}`}
            prompt={prompt}
            src={item.cover}
            alt={`${item.name} fashion collection`}
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-primary-foreground sm:p-6">
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.24em] opacity-80">
                {item.season || 'Seasonal'} / {item.year || '—'}
              </p>
              <h2 className="max-w-sm text-2xl font-semibold tracking-tight sm:text-3xl">{item.name}</h2>
            </div>
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary-foreground/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary-foreground group-hover:text-primary"
              aria-hidden="true"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-6 border-b border-border py-5">
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {item.tagline || 'Um estudo pensado de material, proporção e permanência.'}
        </p>
        {item.is_current && (
          <Badge variant="outline" className="shrink-0 border-primary/40 text-primary">
            Atual
          </Badge>
        )}
      </div>
    </article>
  );
}

export default function Collections() {
  const [items, setItems] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    collection<CollectionRecord>('collection')
      .list({ sort: '-year', limit: 50 })
      .then((rows) => {
        if (active) {
          setItems(rows);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar as coleções. Tente novamente.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-accent/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground">O arquivo</p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary sm:text-6xl">
              Coleções feitas para o longo prazo.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Estudos sazonais de textura, proporção e materiais rastreáveis. Cada um feito para durar além do seu momento.
            </p>
          </div>
          <div className="mt-12 flex items-center gap-3 border-t border-border pt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Layers3 className="size-4 text-primary" />
            <span>{loading ? 'Organizando o arquivo' : `${items.length} collections`}</span>
            <span className="text-border">/</span>
            <CalendarDays className="size-4 text-primary" />
            <span>Desde 2024</span>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          {error && (
            <div className="mx-auto max-w-md py-16 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button className="mt-5" variant="outline" onClick={() => window.location.reload()}>
                Tentar de novo
              </Button>
            </div>
          )}
          {loading && !error && (
            <div className="grid gap-10 md:grid-cols-2">
              {[0, 1].map((item) => (
                <div key={item}>
                  <Skeleton className="aspect-[4/5] w-full" />
                  <Skeleton className="mt-5 h-5 w-2/3" />
                  <Skeleton className="mt-3 h-4 w-full" />
                </div>
              ))}
            </div>
          )}
          {!loading && !error && items.length === 0 && (
            <EmptyState
              icon={Layers3}
              title="O arquivo está tomando forma"
              description="Novas coleções aparecerão aqui em breve."
            />
          )}
          {!loading && !error && items.length > 0 && (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
              {items.map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index, 6) * 60}>
                  <CollectionCard item={item} index={index} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
