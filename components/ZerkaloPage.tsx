import { ArrowDown, ArrowUp, ArrowUpRight, Plus, Star } from 'lucide-react';
import { editorials } from '../data/editorials';
import { locations, widgetFor } from '../data/locations';
import { serviceCatalogs } from '../data/service-catalogs';
import { zerkaloHero, zerkaloWorks } from '../data/zerkalo-images';
import type { Salon } from '../data/salons';
import { HeroBackdrop, Navigation, Reveal, WorksGallery } from './ZerkaloInteractions';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/manrope';
import './zerkalo.css';

export default function ZerkaloPage({ salon, index }: { salon: Salon; index: number }) {
  const editorial = editorials[index];
  const branch = locations.zerkalo[0];
  const [score, ratingCount] = branch.rating;
  const [hair, nails] = serviceCatalogs.zerkalo!.groups;
  const sections = [
    {
      title: hair.name,
      items: [
        ...salon.services.slice(0, 3).map(([name, detail]) => ({ name, detail })),
        ...hair.items,
      ],
    },
    {
      title: nails.name,
      items: [
        ...salon.services.slice(3).map(([name, detail]) => ({ name, detail })),
        ...nails.items,
      ],
    },
  ];
  const listing = `https://2gis.ru/krasnoyarsk/firm/${branch.id}`;
  const photos = `https://2gis.ru/krasnoyarsk/gallery/firm/${branch.id}`;
  const hero = zerkaloHero();

  return (
    <div className="zk">
      <a className="zk-skip" href="#main">К содержанию</a>
      <Navigation name={salon.name} booking={salon.contact} />
      <main id="main">
        <section className="zk-hero" aria-labelledby="zk-title">
          <HeroBackdrop src={hero} />
          <div className="zk-hero-frame" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="zk-hero-copy">
            <p className="zk-kicker zk-enter">Бьюти-студия <span /> Красноярск</p>
            <h1 id="zk-title" className="zk-enter">{salon.name}</h1>
            <p className="zk-hero-line zk-enter">{salon.headline}</p>
            <a className="zk-cta zk-enter" href={salon.contact}>Записаться <ArrowUpRight size={20} /></a>
          </div>
          <div className="zk-hero-bottom">
            <a href="#contacts">{salon.address}</a>
            <a className="zk-scroll" href="#about" aria-label="Перейти к разделу о студии"><ArrowDown size={18} /></a>
            <span>Преображенский</span>
          </div>
        </section>

        <section id="about" className="zk-about zk-wrap" aria-labelledby="zk-about-title">
          <Reveal className="zk-about-label">
            <p className="zk-index"><b>01</b> О студии</p>
            <span className="zk-monogram" aria-hidden="true">Z</span>
          </Reveal>
          <Reveal className="zk-about-copy">
            <h2 id="zk-about-title">Красота<br /><em>в отражении.</em></h2>
            <div>
              <p className="zk-kicker">{editorial.aboutTitle}</p>
              <p>{editorial.about}</p>
              <a className="zk-link" href="#services">Услуги студии <ArrowUpRight size={16} /></a>
            </div>
          </Reveal>
        </section>

        <section id="works" className="zk-works" aria-labelledby="zk-works-title">
          <Reveal className="zk-wrap zk-works-head">
            <p className="zk-index"><b>02</b> Портфолио</p>
            <h2 id="zk-works-title">Наши <em>работы</em></h2>
            <a className="zk-link" href={photos}>Фото студии в 2ГИС <ArrowUpRight size={16} /></a>
          </Reveal>
          <WorksGallery category="hair" label="Стрижки" number="01" images={zerkaloWorks('hair')} />
          <WorksGallery category="nails" label="Ногти" number="02" images={zerkaloWorks('nails')} />
        </section>

        <section id="services" className="zk-services zk-wrap" aria-labelledby="zk-services-title">
          <Reveal className="zk-services-heading">
            <p className="zk-index"><b>03</b> Услуги и цены</p>
            <h2 id="zk-services-title">Меню <em>студии</em></h2>
            <p>{editorial.servicesIntro}</p>
          </Reveal>
          <Reveal className="zk-price">
            {sections.map(({ title, items }, i) => (
              <details key={title} className="zk-price-group" open={i === 0}>
                <summary>
                  <span className="zk-kicker" aria-hidden="true">0{i + 1}</span>
                  <h3>{title}</h3>
                  <span className="zk-plus"><Plus size={19} aria-hidden="true" /></span>
                </summary>
                <ul>
                  {items.map(({ name, detail }) => (
                    <li key={name}><span>{name}</span>{detail && <span>{detail}</span>}</li>
                  ))}
                </ul>
              </details>
            ))}
            <p className="zk-price-note">Итоговую стоимость и доступность услуги подтвердит салон при записи.</p>
          </Reveal>
        </section>

        <section id="contacts" className="zk-contacts" aria-labelledby="zk-contacts-title">
          <div className="zk-wrap zk-contact-grid">
            <Reveal className="zk-contact-copy">
              <p className="zk-index"><b>04</b> Контакты</p>
              <h2 id="zk-contacts-title">До <em>встречи</em></h2>
              <address>
                <span>Красноярск</span>
                <strong>{branch.address}</strong>
              </address>
              <a className="zk-rating" href={listing}>
                <Star size={15} aria-hidden="true" />
                {score.toLocaleString('ru-RU', { minimumFractionDigits: 1 })} в 2ГИС · {ratingCount} оценок
              </a>
              <div className="zk-contact-actions">
                <a className="zk-cta" href={salon.contact}>{salon.action} <ArrowUpRight size={20} /></a>
                <a className="zk-link" href="https://t.me/+79230194638">Запись в Telegram <ArrowUpRight size={16} /></a>
              </div>
            </Reveal>
            <Reveal className="zk-map">
              <iframe src={widgetFor(branch)} title={`Карта 2ГИС · ${branch.address}`} loading="lazy"
                sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" />
              <a className="zk-link" href={listing}>Открыть в 2ГИС <ArrowUpRight size={16} /></a>
            </Reveal>
          </div>
          <footer className="zk-wrap zk-footer">
            <a className="zk-brand" href="#main">{salon.name}</a>
            <p className="zk-kicker">Бьюти-студия · Красноярск</p>
            <a className="zk-back" href="#main">Наверх <ArrowUp size={16} /></a>
          </footer>
        </section>
      </main>
    </div>
  );
}
