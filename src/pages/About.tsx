import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

const FACTS = [
  'Desenhada em coleções pequenas e deliberadas',
  'Materiais rastreáveis escolhidos para durar',
  'Feita com parceiros que conhecemos e a quem voltamos',
];

export default function About() {
  return (
    <div className="overflow-hidden">
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="max-w-3xl">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.28em] text-foreground">A história da Aurelia</p>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Roupa com um ponto de vista mais longo.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              A Aurelia é uma marca de moda lenta construída em torno das peças a que sempre voltamos: discretamente distintas, feitas com cuidado e pensadas para fazer parte de uma vida, não para passar por ela.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:pb-32">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
            <AppImage
              slot="about-studio"
              prompt="minimalist fashion editorial studio, folded natural fabrics and a garment rack, soft north-facing natural light, muted evergreen and oat palette, plain backdrop, no logos, no text, no close-up faces"
              alt="Um ateliê de moda silencioso com tecidos naturais e uma arara"
              className="absolute inset-0"
            />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground">Menos, com critério</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Abrimos espaço para o que dura.</h2>
            <div className="mt-7 space-y-5 text-base leading-7 text-muted-foreground">
              <p>
                A moda anda depressa. Nosso trabalho começa desacelerando: estudar como um tecido cai, como uma costura segura e o que faz uma silhueta continuar certa anos depois.
              </p>
              <p>
                Cada coleção é editada, não ampliada. Trabalhamos com materiais rastreáveis e fabricantes de confiança para criar um guarda-roupa pequeno de camadas, essenciais e detalhes úteis.
              </p>
              <p>
                O resultado é uma roupa de presença calma — feita para o uso repetido, para o cuidado atento e para a história pessoal que dá valor a uma peça favorita.
              </p>
            </div>
            <div className="mt-9 border-t border-border pt-7">
              <ul className="space-y-4">
                {FACTS.map((fact) => (
                  <li key={fact} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3 sm:gap-8 sm:py-20">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-primary">01</p>
              <h3 className="mt-4 text-lg font-semibold">A seleção</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Um guarda-roupa enxuto, construído uma peça útil de cada vez.
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-primary">02</p>
              <h3 className="mt-4 text-lg font-semibold">O material</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Fibras escolhidas pela procedência, pelo toque e por uma vida além de uma estação.
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-primary">03</p>
              <h3 className="mt-4 text-lg font-semibold">A relação</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Uma relação direta e responsável com quem faz nossas roupas.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground">Ver o guarda-roupa</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Comece pela coleção atual.
            </h2>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full px-5">
            <Link to="/collections">
              Ver as coleções
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </section>
      </Reveal>
    </div>
  );
}
