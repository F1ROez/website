import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import SalonPage from '../components/SalonPage';
import { images, photoAtWidth } from '../data/images';
import { salons } from '../data/salons';

const activeIndex = salons.findIndex(({ slug }) => slug === process.env.SALON_SLUG);
const active = salons[activeIndex];
if (process.env.SALON_SLUG && !active) throw new Error('Неизвестный SALON_SLUG. См. README.md.');

export const metadata: Metadata = active ? {
  title: `${active.name} · Красноярск`,
  description: active.description,
  openGraph: { title: active.name, description: active.description, images: [images[activeIndex]] },
  robots: { index: false, follow: false },
} : {
  title: 'Коллекция салонов · Красноярск',
  description: 'Десять демонстрационных сайтов для салонов красоты Красноярска.',
  robots: { index: false, follow: false },
};

export default function Home() {
  if (active) return <SalonPage salon={active} index={activeIndex} standalone />;
  return (
    <main className="collection">
      <header><span>STUDIO / COLLECTION</span><span>КРАСНОЯРСК · 2026</span></header>
      <section className="collection-title">
        <p className="eyebrow">ДЕСЯТЬ ПРОСТРАНСТВ КРАСОТЫ</p>
        <h1>Салоны Красноярска.<br /><em>Коллекция сайтов.</em></h1>
        <p>Десять демонстрационных проектов. Выберите салон, чтобы посмотреть дизайн, меню услуг и запись.</p>
      </section>
      <div className="collection-grid">
        {salons.map((salon, i) => (
          <article key={salon.slug}>
            <a className={`preview preview-${i}`} style={{ background: salon.background, color: salon.color }}
              href={`/${salon.slug}/`} aria-label={`Открыть сайт «${salon.name}»`}>
              <img src={images[i]} srcSet={photoAtWidth(images[i])} sizes="(max-width: 640px) 88vw, 44vw"
                alt="" loading={i > 1 ? 'lazy' : 'eager'} decoding="async" />
              <div><small>{salon.label}</small><h2>{salon.name}</h2><p>{salon.headline}</p></div>
              <ArrowUpRight />
            </a>
            <div className="card-title">
              <h3>{String(i + 1).padStart(2, '0')} / {salon.name}</h3>
              <span>{i === 0 ? 'Есть микросайт 2ГИС' : salon.old ? 'Есть действующий сайт' : 'Отдельный сайт не найден'}</span>
            </div>
            <p>{salon.concept}</p>
            <a href={`/${salon.slug}/`}>Открыть сайт ↗</a>
          </article>
        ))}
      </div>
      <footer>Демонстрационные фотографии · Публичные контакты салонов</footer>
    </main>
  );
}
