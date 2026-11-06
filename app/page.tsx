import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import SalonPage from '../components/SalonPage';
import { salonPhoto } from '../data/images';
import { salons } from '../data/salons';

const activeIndex = salons.findIndex(({ slug }) => slug === process.env.SALON_SLUG);
const active = salons[activeIndex];
if (process.env.SALON_SLUG && !active) throw new Error('Неизвестный SALON_SLUG. См. README.md.');

export const metadata: Metadata = active ? {
  title: `${active.name} · Красноярск`,
  description: active.description,
  openGraph: { title: active.name, description: active.description, images: [salonPhoto(active.slug, 'hero').src] },
  robots: { index: false, follow: false },
} : {
  title: 'Салоны красоты · Красноярск',
  description: 'Салоны красоты Красноярска. Услуги, адреса и запись.',
  robots: { index: false, follow: false },
};

export default function Home() {
  if (active) return <SalonPage salon={active} index={activeIndex} />;
  return (
    <main className="collection">
      <header><span>САЛОНЫ КРАСОТЫ</span><span>КРАСНОЯРСК</span></header>
      <section className="collection-title">
        <p className="eyebrow">ДЕСЯТЬ ПРОСТРАНСТВ КРАСОТЫ</p>
        <h1>Салоны красоты<br /><em>Красноярска</em></h1>
        <p>Выберите салон, чтобы посмотреть услуги, адрес и способы записи.</p>
      </section>
      <div className="collection-grid">
        {salons.map((salon, i) => (
          <article key={salon.slug}>
            <a className={`preview preview-${i}`} style={{ background: salon.background, color: salon.color }}
              href={`/${salon.slug}/`} aria-label={`Открыть сайт «${salon.name}»`}>
              <img src={salonPhoto(salon.slug, 'hero').src}
                alt="" loading={i > 1 ? 'lazy' : 'eager'} decoding="async" />
              <div><small>{salon.label}</small><h2>{salon.name}</h2><p>{salon.headline}</p></div>
              <ArrowUpRight />
            </a>
            <p className="collection-description">{salon.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
