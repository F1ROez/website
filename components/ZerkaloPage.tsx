import { ArrowDown, ArrowUp, ArrowUpRight, MapPin, Star } from 'lucide-react';
import { locations, widgetFor } from '../data/locations';
import { zerkaloContactEye, zerkaloHero, zerkaloServicesPhoto, zerkaloWorks } from '../data/zerkalo-images';
import { zerkaloPrices } from '../data/zerkalo-prices';
import type { Salon } from '../data/salons';
import { HeroBackdrop, Navigation, PriceAccordion, Reveal, WorksGallery } from './ZerkaloInteractions';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/manrope';
import './zerkalo.css';

function SectionSeam() {
  return <div className="zk-section-seam" aria-hidden="true"><span /></div>;
}

export default function ZerkaloPage({ salon }: { salon: Salon }) {
  const branch = locations.zerkalo[0];
  const phone = branch.phone?.replace(/[^+\d]/g, '');
  const [score, ratingCount] = branch.rating;
  const listing = `https://2gis.ru/krasnoyarsk/firm/${branch.id}`;
  const photos = `https://2gis.ru/krasnoyarsk/gallery/firm/${branch.id}`;
  const eye = zerkaloContactEye();
  const servicesPhoto = zerkaloServicesPhoto();

  return (
    <div className="zk">
      <a className="zk-skip" href="#main">К содержанию</a>
      <Navigation name={salon.name} booking={salon.contact} />
      <main id="main">
        <section className="zk-hero" aria-labelledby="zk-title">
          <HeroBackdrop src={zerkaloHero()} />
          <div className="zk-hero-frame" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="zk-hero-copy">
            <p className="zk-kicker zk-enter">Бьюти-студия <span /> Красноярск</p>
            <h1 id="zk-title" className="zk-enter">{salon.name}</h1>
            <p className="zk-hero-line zk-enter">{salon.headline}</p>
            <a className="zk-cta zk-enter" href={salon.contact}>Записаться <ArrowUpRight size={20} /></a>
          </div>
          <div className="zk-hero-bottom">
            <a href="#contacts">{salon.address}</a>
            <a className="zk-scroll" href="#contacts" aria-label="Перейти к контактам"><ArrowDown size={18} /></a>
            <span>Преображенский</span>
          </div>
        </section>

        <section id="contacts" className="zk-contacts" aria-labelledby="zk-contacts-title">
          <SectionSeam />
          {eye && (
            <div className="zk-contact-art" aria-hidden="true">
              <img src={eye} alt="" loading="lazy" decoding="async" />
            </div>
          )}
          <div className="zk-wrap zk-contact-grid">
            <Reveal className="zk-contact-copy">
              <p className="zk-index"><b>01</b> Контакты</p>
              <h2 id="zk-contacts-title">До <em>встречи</em></h2>
              <address>
                <span>Красноярск · Преображенский</span>
                <strong>{branch.address}</strong>
              </address>
              <a className="zk-rating" href={listing}>
                <Star size={15} aria-hidden="true" />
                {score.toLocaleString('ru-RU', { minimumFractionDigits: 1 })} в 2ГИС · {ratingCount} оценок
              </a>
              {phone && <a className="zk-phone" href={`tel:${phone}`}>{branch.phone}</a>}
              <div className="zk-contact-actions">
                <a className="zk-cta" href={salon.contact}>{salon.action} <ArrowUpRight size={20} /></a>
                <a className="zk-link" href="https://t.me/+79230194638">Запись в Telegram <ArrowUpRight size={16} /></a>
              </div>
            </Reveal>
            <Reveal className="zk-map">
              <iframe src={widgetFor(branch)} title={`Карта 2ГИС · ${branch.address}`} loading="lazy"
                sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" />
              <a href={listing} aria-label="Открыть карту в 2ГИС">
                <MapPin size={16} aria-hidden="true" /> <span>Открыть в 2ГИС</span> <ArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>
        </section>

        <section id="services" className="zk-services" aria-labelledby="zk-services-title">
          <SectionSeam />
          {servicesPhoto && (
            <div className="zk-services-art" aria-hidden="true">
              <img src={servicesPhoto} alt="" loading="lazy" decoding="async" />
            </div>
          )}
          <div className="zk-wrap zk-services-grid">
            <Reveal className="zk-services-heading">
              <p className="zk-index"><b>02</b> Услуги и цены</p>
              <h2 id="zk-services-title">Меню <em>студии</em></h2>
              <p>Выберите категорию, чтобы посмотреть услуги и стоимость.</p>
              <a className="zk-link" href={`${listing}/tab/prices`}>Прайс в 2ГИС <ArrowUpRight size={16} /></a>
            </Reveal>
            <div className="zk-price">
              <PriceAccordion groups={zerkaloPrices} />
              <p className="zk-price-note">Прайс 2ГИС обновлён 28 октября 2026 года. Итоговую стоимость уточняйте при записи.</p>
            </div>
          </div>
        </section>

        <section id="works" className="zk-works" aria-labelledby="zk-works-title">
          <SectionSeam />
          <Reveal className="zk-wrap zk-works-head">
            <p className="zk-index"><b>03</b> Портфолио</p>
            <h2 id="zk-works-title">Наши <em>работы</em></h2>
            <a className="zk-link" href={photos}>Фото студии в 2ГИС <ArrowUpRight size={16} /></a>
          </Reveal>
          <WorksGallery category="hair" label="Стрижки" number="01" images={zerkaloWorks('hair')} />
          <WorksGallery category="nails" label="Ногти" number="02" images={zerkaloWorks('nails')} />
        </section>
      </main>
      <div className="zk-footer-band">
        <footer className="zk-wrap zk-footer">
          <a className="zk-brand" href="#main">{salon.name}</a>
          <p className="zk-kicker">Бьюти-студия · Красноярск</p>
          <a className="zk-back" href="#main">Наверх <ArrowUp size={16} /></a>
        </footer>
      </div>
    </div>
  );
}
