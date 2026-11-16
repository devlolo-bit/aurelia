import { useEffect, useState } from 'react';
import { ArrowDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { amitseHero } from '@/lib/amitse-images';
import {
  photoApp,
  photoBoard,
  photoCar,
  photoCircle,
  photoDinner,
  photoOds,
  photoWine,
} from '@/lib/amitse-photos';
import { Button } from '@/components/ui/button';
import { collection } from '@/lib/fab-client';
import { toast } from '@/components/ui/sonner';
import { Reveal } from '@/components/ui/reveal';

const STATS = [
  {
    value: '22%',
    title: 'A desigualdade na remuneração',
    text: 'No Brasil, as mulheres receberam, em média, 22% menos que os homens em 2024. Isso significa menor capacidade de acumular patrimônio, investir e construir independência financeira.',
  },
  {
    value: '2,1x',
    title: 'A sobrecarga do trabalho não remunerado',
    text: 'Em 2022, mulheres brasileiras dedicaram 11,8% do dia a afazeres domésticos e cuidados não remunerados, contra 5,7% dos homens. Esse tempo também representa oportunidades profissionais e pessoais que podem ficar comprometidas.',
  },
  {
    value: '31%',
    title: 'As limitações à participação profissional',
    text: 'Cerca de 31% das mulheres brasileiras que estavam fora da força de trabalho apontaram as responsabilidades domésticas e de cuidado como impedimento para trabalhar.',
  },
  {
    value: '67%',
    title: 'A desigualdade nas oportunidades econômicas',
    text: 'Segundo o Banco Mundial, em 2026, as mulheres possuem, em média, 67% dos direitos legais econômicos reconhecidos aos homens no mundo. Isso mostra que a igualdade de oportunidades ainda está longe de ser alcançada.',
  },
];

const STEPS = [
  { title: 'Cadastro', text: 'Você preenche nome, e-mail e WhatsApp e aceita a política de privacidade.' },
  { title: 'Questionário', text: 'Respostas que nos ajudam a entender a sua trajetória e os seus objetivos.' },
  { title: 'Análise', text: 'O time Âmitse avalia cada aplicação com atenção.' },
  { title: 'Devolutiva por e-mail', text: 'Você recebe o resultado da análise no seu e-mail.' },
  { title: 'Pagamento após aprovação', text: 'Nenhuma cobrança antes da aprovação. Os dados de pagamento chegam no e-mail de aprovação.' },
  { title: 'Acesso ao app', text: 'Após o pagamento, você recebe as informações para baixar e criar a sua conta no app.' },
  { title: 'Torne-se Membra', text: 'Entre para a comunidade Âmitse e comece a arquitetar a sua autonomia.' },
];

const RECEIVES = [
  { title: 'Educação', text: 'Conteúdo para construir autonomia pessoal e profissional.' },
  { title: 'Acompanhamento', text: 'Orientação do time Âmitse ao longo da sua jornada.' },
  { title: 'Pertencimento', text: 'Estar com a equipe Âmitse e com outras membras.' },
  { title: 'Comunidade', text: 'Uma rede de mulheres que constroem ativos juntas.' },
];

const applySchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome completo.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  whatsapp: z.string().trim().min(10, 'Informe um WhatsApp válido, com DDD.'),
  consent: z.boolean().refine((value) => value, 'É preciso aceitar a política de privacidade.'),
});

type ApplyErrors = Partial<Record<'name' | 'email' | 'whatsapp' | 'consent', string>>;

export default function Home() {
  const [ctaPulse, setCtaPulse] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const ctaOn = ctaPulse || ctaHover;
  function pulseCta(event: { preventDefault: () => void }) {
    event.preventDefault();
    setCtaPulse(true);
    window.setTimeout(() => {
      setCtaPulse(false);
      document.getElementById('aplicacao')?.scrollIntoView({ behavior: 'smooth' });
    }, 900);
  }

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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ApplyErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = applySchema.safeParse({ name, email, whatsapp, consent });
    if (!result.success) {
      const next: ApplyErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ApplyErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      // PENDENTE: criar o modelo "application" no Fabapp com os campos abaixo.
      await collection('application').create({
        name: result.data.name,
        email: result.data.email,
        whatsapp: result.data.whatsapp,
        privacy_consent: true,
        consent_at: now,
        created_at: now,
      });
      setSent(true);
    } catch {
      toast.error('Algo deu errado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full border-0 border-b border-[#090079]/40 bg-transparent px-0 pb-2 text-[#090079] placeholder:text-[#090079]/50 focus:border-[#1200E2] focus:outline-none';

  return (
    <div>
      {/* 1. Hero */}
      <section
        className="relative flex min-h-[calc(100svh-4rem)] items-end overflow-hidden text-white"
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
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32 sm:pb-24">
          <p className="text-xs uppercase tracking-[0.28em] text-white/75">Âmitse · A Arquiteta da Autonomia da Mulher</p>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl">
            Mulher, torne-se Arquiteta da sua Autonomia
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            Afinal, o seu maior poder é bancar suas próprias escolhas.
          </p>
          <div className="mt-16">
            <Button
              asChild
              size="lg"
              onClick={pulseCta}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={{
                backgroundColor: ctaOn ? '#69FF01' : '#1200E2',
                color: ctaOn ? '#1200E2' : '#FFFFFF',
                animation: ctaOn ? 'amitse-zoom 0.9s ease-in-out' : undefined,
              }}
              className="rounded-full px-8 transition-colors duration-300 ease-out active:scale-95"
            >
              <a href="#aplicacao">
                <ArrowDown /> Quero Arquitetar a minha Autonomia
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Por que arquitetar a própria autonomia */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-[#1200E2]">Por que arquitetar a própria autonomia?</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Uma conquista individual que transforma a realidade de todas.
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed text-black/70">
              <p>
                A autonomia feminina não é apenas uma conquista individual. É uma forma de transformar a realidade econômica,
                profissional e social das mulheres.
              </p>
              <p>
                Arquitetar a própria autonomia significa desenvolver recursos, conhecimentos, habilidades, independência
                financeira e redes de apoio para ter liberdade de escolha e poder de decisão sobre a própria vida.
              </p>
              <p>
                Mas por que isso é tão importante? Porque os dados mostram que ainda existem desigualdades estruturais que
                limitam as possibilidades das mulheres.
              </p>
            </div>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2">
            {STATS.map((stat, index) => (
              <Reveal key={stat.value} delay={index * 80}>
                <div className="border-t border-black/10 pt-7">
                  <p className="text-5xl font-semibold tracking-tight text-[#1200E2]">{stat.value}</p>
                  <h3 className="mt-3 text-lg font-medium">{stat.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/65">{stat.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-12 max-w-3xl leading-relaxed text-black/70">
            Acreditamos que cada mulher deve ter condições de determinar os próprios caminhos, sustentar suas escolhas e
            construir um futuro que não esteja condicionado à dependência financeira, profissional ou pessoal de terceiros.
          </p>
          <p className="mt-4 max-w-3xl font-medium leading-relaxed text-black">
            Porque autonomia não é apenas ter liberdade para escolher. É possuir recursos, conhecimento, segurança e poder
            para fazer acontecer.
          </p>
        </div>
      </section>

      {/* 3. O que é a Âmitse + ODS */}
      <section id="sobre" className="bg-[#f4f4fb] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 sm:grid-cols-2 sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#1200E2]">O que é a Âmitse</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Arquitetar a própria autonomia e unir forças.
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-black/70">
                <p>
                  Arquitetar a própria autonomia e unir forças com outras mulheres, fortalecendo umas às outras para
                  transformar realidades, romper barreiras e construir novos futuros.
                </p>
                <p>
                  Acreditamos que arquitetar a própria autonomia impulsiona a igualdade de gênero. Por isso, apoiamos mulheres
                  a desenvolverem seu potencial, construírem ativos próprios, conquistarem independência financeira e
                  assumirem o protagonismo de suas escolhas e trajetórias.
                </p>
                <p>
                  Unimos tecnologia, autoliderança, individualidade e comunidade para que cada mulher assuma o comando da
                  própria trajetória, construa sua independência financeira e desenvolva as condições necessárias para
                  sustentar suas escolhas.
                </p>
                <p>
                  Porque autonomia não é apenas poder escolher. É ter recursos, conhecimento e segurança para decidir o
                  próprio caminho, sem precisar pedir permissão para isso.
                </p>
              </div>
            </div>
            <img
              src={photoCar}
              alt="Mulher sorridente sentada ao volante de um carro, com roupa executiva"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="mt-16 grid gap-10 border-t border-black/10 pt-12 sm:grid-cols-[200px_1fr] sm:items-start">
            <img src={photoOds} alt="Logo do ODS 5, Igualdade de gênero" className="w-full max-w-[200px]" />
            <div>
              <p className="text-sm font-medium text-[#1200E2]">
                ODS 5 · Alcançar a igualdade de gênero e empoderar todas as mulheres e meninas
              </p>
              <p className="mt-4 text-sm font-medium leading-relaxed text-black">
                Meta 5.b: Aumentar o uso de tecnologias para promover o empoderamento das mulheres
              </p>
              <p className="mt-3 text-sm leading-relaxed text-black/70">
                A Âmitse oferece às mulheres ferramentas profissionais e pessoais para construir caminhos de autonomia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Como funciona */}
      <section id="como-funciona" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:grid-cols-2 sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#1200E2]">Como funciona</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Do cadastro à sua primeira semana como membra.</h2>
            <ol className="mt-10 space-y-6">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-5 border-t border-black/10 pt-5">
                  <p className="w-8 shrink-0 text-sm font-medium text-[#1200E2]">0{index + 1}</p>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-black/65">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <img
            src={photoBoard}
            alt="Equipe reunida em uma mesa estruturando uma marca sustentável"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </section>

      {/* 5. O que você recebe */}
      <section className="bg-[#1200E2] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 sm:grid-cols-2 sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#69FF01]">O que você recebe</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                O app facilita. O pertencimento é o produto.
              </h2>
              <div className="mt-10 grid gap-0 sm:grid-cols-2">
                {RECEIVES.map((item) => (
                  <div key={item.title} className="border-t border-white/25 py-6 pr-6">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <img
              src={photoApp}
              alt="Tela inicial do app Âmitse com a trilha de autoliderança"
              className="mx-auto w-full max-w-sm object-contain"
            />
          </div>
          <img
            src={photoCircle}
            alt="Grupo de mulheres conversando em círculo"
            className="mt-16 aspect-[16/9] w-full object-cover"
          />
        </div>
      </section>

      {/* 6. Manifesto */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:grid-cols-2">
          <img
            src={photoDinner}
            alt="Cinco mulheres conversando à mesa de um jantar"
            className="aspect-[4/3] w-full object-cover"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#1200E2]">Manifesto</p>
            <p className="mt-6 text-2xl leading-snug tracking-tight sm:text-3xl">
              Mulher, o seu maior poder é bancar suas próprias escolhas. A autonomia se arquiteta, não se espera.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Formulário de aplicação */}
      <section id="aplicacao" className="bg-[#090079] py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Mulher, o seu maior poder é bancar suas próprias escolhas.</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Preencha os dados abaixo para se inscrever na Lista de Espera. Cada aplicação é analisada pelo time Âmitse, e o
              resultado chega no seu e-mail.
            </p>
          </div>
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-[#090079]">
            {sent ? (
              <div className="flex items-center gap-3 text-sm">
                <Check className="size-4" /> Recebemos a sua aplicação. Em breve você terá a devolutiva no seu e-mail.
              </div>
            ) : (
              <form onSubmit={submitApplication} noValidate className="space-y-7">
                <p className="text-sm">
                  <span className="font-semibold">Preencha os dados abaixo</span> para se inscrever na Lista de Espera:
                </p>
                <div>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nome completo"
                    aria-label="Nome completo"
                    className={inputClass}
                  />
                  {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="E-mail"
                    aria-label="E-mail"
                    className={inputClass}
                  />
                  {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                    placeholder="WhatsApp com DDD"
                    aria-label="WhatsApp com DDD"
                    className={inputClass}
                  />
                  {errors.whatsapp && <p className="mt-2 text-xs text-red-600">{errors.whatsapp}</p>}
                </div>
                <div>
                  <label className="flex items-start gap-3 text-sm leading-relaxed">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-1 size-4 shrink-0 accent-[#1200E2]"
                    />
                    <span>
                      Li e aceito a{' '}
                      <Link to="/privacidade" className="underline underline-offset-4">
                        política de privacidade
                      </Link>
                      . Entendo que a data e a hora deste aceite ficam registradas.
                    </span>
                  </label>
                  {errors.consent && <p className="mt-2 text-xs text-red-600">{errors.consent}</p>}
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full border-2 border-[#1200E2] bg-white px-8 text-[#1200E2] hover:bg-[#1200E2] hover:text-white"
                  >
                    {submitting ? 'Enviando…' : 'Quero Arquitetar a minha Autonomia'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
