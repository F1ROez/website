'use client';

import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, MapPin, Menu, Plus, Star, X } from 'lucide-react';
import { salonPhoto } from '../data/images';
import { locations, widgetFor } from '../data/locations';
import { editorials } from '../data/editorials';
import { serviceCatalogs } from '../data/service-catalogs';
import type { Salon } from '../data/salons';

const ratingFormat = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const ratingPlural = new Intl.PluralRules('ru-RU');
const ratingWords = { one: 'оценка', few: 'оценки', many: 'оценок', other: 'оценок', zero: 'оценок', two: 'оценки' };

const nav = [['Услуги', '#services'], ['О салоне', '#about'], ['Контакты', '#contacts']];

export default function SalonPage({ salon, index }: { salon: Salon; index: number }) {
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const branches = locations[salon.slug];
  const branch = branches[selected];
  const editorial = editorials[index];
  const heroPhoto = salonPhoto(salon.slug, 'hero');
  const detailPhoto = salonPhoto(salon.slug, 'detail');
  const catalog = serviceCatalogs[salon.slug];
  const hasHighlights = salon.services.length > 0;
  const servicesLabel = hasHighlights ? 'Услуги' : catalog?.title ?? 'Услуги';
  const action = branch.contact ?? salon.contact;
  const label = branch.action ?? salon.action;
  const phoneHref = branch.phone ? `tel:${branch.phone.replace(/[^+\d]/g, '')}` : undefined;
  const multipleBranches = branches.length > 1;
  const [score, ratingCount] = branch.rating;
  const primary = multipleBranches ? '#contacts' : action;
  const primaryLabel = multipleBranches ? 'Выбрать филиал' : label;
  const rise = reduced ? false : { opacity: .78, y: 16 };

  return (
    <div className={`salon design-${index}`} style={{ '--bg': salon.background, '--accent': salon.color } as CSSProperties}>
      <a className="skip-link" href="#main">К содержанию</a>
      <header onKeyDown={(event) => {
        if (event.key === 'Escape' && menu) {
          setMenu(false);
          menuButton.current?.focus();
        }
      }}>
        <a className="wordmark" href="#main">{salon.name}<small>{salon.label}</small></a>
        <nav aria-label="Основная навигация" id="salon-navigation" className={menu ? 'open' : ''}>
          {nav.map(([name, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{href === '#services' ? servicesLabel : name}</a>)}
        </nav>
        <button className="menu" type="button" ref={menuButton} aria-controls="salon-navigation"
          aria-expanded={menu} aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenu(!menu)}>
          {menu ? <X /> : <Menu />}
        </button>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image">
            <img src={heroPhoto.src} fetchPriority="high" alt={heroPhoto.alt} />
          </div>
          <motion.div className="hero-copy" initial={rise} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <p className="eyebrow">Красноярск / {salon.label}</p>
            <h1 id="hero-title">{salon.headline}</h1>
            <p className="intro">{salon.description}</p>
            <div className="actions">
              <a className="button" href={primary}>{primaryLabel}<ArrowUpRight size={20} /></a>
              <a className="text-link" href="#services">{hasHighlights ? 'Смотреть услуги' : servicesLabel} <ArrowRight size={17} /></a>
            </div>
          </motion.div>
          <div className="hero-bottom">
            <span><MapPin size={15} aria-hidden="true" />{multipleBranches ? `Адреса · ${branches.length}` : salon.address}</span>
          </div>
        </section>

        <section id="services" className="services section" aria-labelledby="services-title">
          <div className="section-heading">
            <p className="eyebrow">01 / Услуги</p>
            <h2 id="services-title">{hasHighlights ? editorial.servicesTitle : catalog?.title}</h2>
            <p>{hasHighlights ? editorial.servicesIntro : catalog?.intro}</p>
          </div>
          {hasHighlights && <div className="service-grid">
            {salon.services.map(([name, price], i) => (
              <motion.article className="service" key={name} initial={rise} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .15 }} transition={{ duration: .3, delay: reduced ? 0 : i * .045 }}>
                <span className="service-number">{String(i + 1).padStart(2, '0')}</span>
                <h3>{name}</h3>
                <div><span>{price}</span></div>
              </motion.article>
            ))}
          </div>}
          {catalog && (
            <div className={`service-catalog${hasHighlights ? ' service-catalog-extra' : ''}`}>
              {hasHighlights && <div className="catalog-heading"><h3>{catalog.title}</h3><p>{catalog.intro}</p></div>}
              <div className={`catalog-groups${catalog.groups.length === 3 ? ' catalog-groups-three' : ''}`}>
                {catalog.groups.map((group, groupIndex) => {
                  const heading = (
                    <>
                      <span className="catalog-index" aria-hidden="true">{String(groupIndex + 1).padStart(2, '0')}</span>
                      <span>{group.name}</span>
                    </>
                  );
                  const content = (
                    <>
                      {group.description && <p className="catalog-description">{group.description}</p>}
                      <ul className="catalog-items">
                        {group.items.map((item) => (
                          <li key={item.name}><span>{item.name}</span>{item.detail && <span>{item.detail}</span>}</li>
                        ))}
                      </ul>
                    </>
                  );

                  return group.disclosure ? (
                    <details key={group.name} className="catalog-group" open={group.disclosure === 'open'}>
                      <summary>{heading}<Plus size={18} aria-hidden="true" /></summary>
                      {content}
                    </details>
                  ) : (
                    <article key={group.name} className="catalog-group catalog-card">
                      <h4 className="catalog-card-title">{heading}</h4>
                      {content}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
          {(catalog || salon.services.some(([, price]) => price.includes('₽'))) &&
            <small className="price-note">Итоговую стоимость и доступность услуги подтвердит салон при записи.</small>}
        </section>

        <section id="about" className="about section" aria-labelledby="about-title">
          <motion.figure className="about-art" initial={reduced ? false : { opacity: .45 }}
            whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .6 }}>
            <img loading="lazy" decoding="async" src={detailPhoto.src} alt={detailPhoto.alt} />
          </motion.figure>
          <div>
            <p className="eyebrow">02 / {salon.name}</p>
            <h2 id="about-title">{editorial.aboutTitle}</h2>
            <p>{editorial.about}</p>
          </div>
        </section>

        <section id="contacts" className="contacts section" aria-labelledby="contacts-title">
          <div className="contact-copy">
            <p className="eyebrow">03 / Контакты</p>
            <h2 id="contacts-title">{multipleBranches ? 'Выберите адрес' : 'До встречи'}</h2>
            {multipleBranches && (
              <div className="branch-list" role="group" aria-label="Филиалы">
                {branches.map((item, i) => (
                  <button type="button" aria-pressed={i === selected} key={item.id} onClick={() => setSelected(i)}>
                    {item.short ?? item.address}
                  </button>
                ))}
              </div>
            )}
            <div className="address" aria-live="polite">
              <MapPin size={18} />
              <div>
                <strong>{branch.address}</strong>
                <span>Красноярск{branch.hours && ` · ${branch.hours}`}</span>
                <div className="branch-rating">
                  <Star size={16} aria-hidden="true" />
                  <b>{ratingFormat.format(score)}</b> в 2ГИС · {ratingCount} {ratingWords[ratingPlural.select(ratingCount)]}
                </div>
              </div>
            </div>
            {(multipleBranches || branch.phone || salon.slug === 'karina-meyskaya') && (
              <div className="contact-actions">
                {multipleBranches && <a className="button" href={action}>{label}<ArrowUpRight size={18} /></a>}
                {branch.phone && phoneHref && action !== phoneHref &&
                  <a className="text-link" href={phoneHref}>{branch.phone}</a>}
                {branch.phone && action === phoneHref && <span className="contact-phone">{branch.phone}</span>}
                {salon.slug === 'karina-meyskaya' && <a className="text-link" href="https://t.me/+79330269666">Запись в Telegram</a>}
              </div>
            )}
          </div>
          <iframe key={branch.id} className="contact-map" src={widgetFor(branch)} title={`Карта 2ГИС · ${branch.address}`}
            loading="lazy" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" />
        </section>
      </main>

      <footer>
        <a className="wordmark" href="#main">{salon.name}</a>
        <p>Красноярск</p>
      </footer>
    </div>
  );
}
