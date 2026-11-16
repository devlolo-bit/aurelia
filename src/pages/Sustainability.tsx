import { useEffect, useState } from 'react';
import { ArrowDown, Leaf } from 'lucide-react';
import { collection, RichText } from '@/lib/fab-client';
import { AppImage } from '@/components/ui/app-image';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

type Pillar = {
  id: string;
  title: string;
  description?: string;
  detail?: string;
  icon?: string;
  metric?: string;
  sort_order?: number;
};

export default function Sustainability() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    collection<Pillar>('pillar')
      .list({ sort: 'sort_order' })
      .then(setPillars)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 -z-10 opacity-55">
          <AppImage
            slot="sustainability-hero"
            prompt="minimalist fashion editorial still life of natural fibers and an unbleached garment, soft natural light, muted evergreen and bone palette, plain backdrop, no logos, no text"
            alt="Fibras naturais e uma peça pensada"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-primary/70" />
        <div className="mx-auto flex min-h-[520px] max-w-6xl flex-col justify-end px-6 py-16 sm:min-h-[600px] sm:py-20">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-primary-foreground">
            Como a Aurelia é feita
          </p>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Materiais melhores. Menos coisas, que duram mais.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground">
            Seguimos cada peça até a origem e a fazemos para ser usada bem e por muito tempo.
          </p>
          <div className="mt-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-primary-foreground/60">
            <ArrowDown className="size-4" aria-hidden="true" />
            Ver nossos compromissos
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-10 border-b border-border pb-12 sm:grid-cols-[1fr_2fr] sm:gap-16 sm:pb-16">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Nosso padrão</p>
          <div>
            <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Rastreabilidade não é um recurso. É o ponto de partida.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Toda decisão tem consequência. Escolhemos fibras de origem clara, trabalhamos com parceiros que conhecemos e mantemos as coleções deliberadamente pequenas. O resultado é um guarda-roupa mais quieto, com uma história mais clara.
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          {loading && (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-5 border-t border-border pt-6">
                  <Skeleton className="size-11 rounded-full" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="border-t border-border py-12 text-center text-muted-foreground">
              Não foi possível carregar nossos compromissos agora. Tente de novo em instantes.
            </div>
          )}

          {!loading && !error && pillars.length === 0 && (
            <EmptyState
              icon={Leaf}
              title="Nossos compromissos estão tomando forma"
              description="Volte em breve para saber mais sobre como a Aurelia é feita."
            />
          )}

          {!loading && !error && pillars.length > 0 && (
            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar) => (
                <article key={pillar.id} className="border-t border-border pt-6">
                  <div className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                    {pillar.icon ? <Icon name={pillar.icon} className="size-5" /> : <Leaf className="size-5" />}
                  </div>
                  {pillar.metric && (
                    <p className="mt-6 text-2xl font-semibold tracking-tight text-primary">{pillar.metric}</p>
                  )}
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{pillar.title}</h3>
                  {pillar.description && <p className="mt-3 text-sm font-medium leading-6">{pillar.description}</p>}
                  {pillar.detail && (
                    <RichText html={pillar.detail} className="mt-4 text-sm leading-7 text-muted-foreground" />
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-[1fr_2fr] sm:items-center sm:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Uma visão mais longa</p>
          <p className="max-w-2xl text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl">
            Ainda estamos aprendendo. Publicamos o que sabemos, medimos o que conseguimos e deixamos espaço para fazer melhor a cada estação.
          </p>
        </div>
      </section>
    </div>
  );
}
