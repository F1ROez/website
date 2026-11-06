'use client';

import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, MapPin, Menu, X } from 'lucide-react';
import { images, detailImages, photoAtWidth } from '../data/images';
import { locations, routeFor, widgetFor } from '../data/locations';
import { editorials } from '../data/editorials';
import type { Salon } from '../data/salons';

const nav = [['Услуги', '#services'], ['О салоне', '#about'], ['Контакты', '#contacts']];

export default function SalonPage({ salon, index }: { salon: Salon; index: number }) {
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const branches = locations[salon.slug];
  const branch = branches[selected];
  const editorial = editorials[index];
  const action = branch.contact ?? salon.contact;
  const label = branch.action ?? salon.action;
  const phoneHref = branch.phone ? `tel:${branch.phone.replace(/[^+\d]/g, '')}` : undefined;
  const primary = branches.length > 1 ? '#contacts' : action;
  const primaryLabel = branches.length > 1 ? 'Выбрать филиал' : label;
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
          {nav.map(([name, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{name}</a>)}
        </nav>
        <a className="button compact" href={primary}>{primaryLabel}<ArrowUpRight size={17} /></a>
        <button className="menu" type="button" ref={menuButton} aria-controls="salon-navigation"
          aria-expanded={menu} aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenu(!menu)}>
          {menu ? <X /> : <Menu />}
        </button>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image">
            <img src={images[index]} srcSet={photoAtWidth(images[index])} sizes="(max-width: 640px) 100vw, 90vw"
              fetchPriority="high" alt={editorial.heroAlt} />
          </div>
          <motion.div className="hero-copy" initial={rise} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <p className="eyebrow">Красноярск / {salon.label}</p>
            <h1 id="hero-title">{salon.headline}</h1>
            <p className="intro">{salon.description}</p>
            <div className="actions">
              <a className="button" href={primary}>{primaryLabel}<ArrowUpRight size={20} /></a>
              <a className="text-link" href="#services">Смотреть услуги <ArrowRight size={17} /></a>
            </div>
          </motion.div>
          <div className="hero-bottom">
            <a href="#contacts"><MapPin size={15} />{branches.length > 1 ? `Адреса · ${branches.length}` : salon.address}</a>
            <a href="#services">Листайте дальше ↓</a>
          </div>
        </section>

        <section id="services" className="services section" aria-labelledby="services-title">
          <div className="section-heading">
            <p className="eyebrow">01 / Услуги</p>
            <h2 id="services-title">{editorial.servicesTitle}</h2>
            <p>{editorial.servicesIntro}</p>
          </div>
          <div className="service-grid">
            {salon.services.map(([name, price], i) => (
              <motion.a className="service" key={name} href={primary} initial={rise} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .15 }} transition={{ duration: .3, delay: reduced ? 0 : i * .045 }}>
                <span className="service-number">{String(i + 1).padStart(2, '0')}</span>
                <h3>{name}</h3>
                <div><span>{price}</span><ArrowUpRight size={19} /></div>
              </motion.a>
            ))}
          </div>
          {salon.services.some(([, price]) => price.includes('₽')) &&
            <small className="price-note">Итоговую стоимость и доступность услуги подтвердит салон при записи.</small>}
        </section>

        <section id="about" className="about section" aria-labelledby="about-title">
          <motion.figure className="about-art" initial={reduced ? false : { opacity: .45 }}
            whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .6 }}>
            <img loading="lazy" decoding="async" src={detailImages[index]} srcSet={photoAtWidth(detailImages[index])}
              sizes="(max-width: 640px) 88vw, 45vw" alt="Иллюстрация парикмахерского направления" />
          </motion.figure>
          <div>
            <p className="eyebrow">02 / {salon.name}</p>
            <h2 id="about-title">{editorial.aboutTitle}</h2>
            <p>{editorial.about}</p>
            {editorial.more && <a className="text-link" href={editorial.more.href} target="_blank" rel="noreferrer">
              {editorial.more.label}<ArrowUpRight size={17} />
            </a>}
          </div>
        </section>

        <section id="contacts" className="contacts section" aria-labelledby="contacts-title">
          <div className="contact-copy">
            <p className="eyebrow">03 / Контакты</p>
            <h2 id="contacts-title">{branches.length > 1 ? 'Выберите адрес' : 'До встречи'}</h2>
            {branches.length > 1 && (
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
              <div><strong>{branch.address}</strong><span>Красноярск{branch.hours && ` · ${branch.hours}`}</span></div>
            </div>
            <div className="contact-actions">
              <a className="button" href={action}>{label}<ArrowUpRight size={18} /></a>
              {branch.phone && phoneHref && action !== phoneHref &&
                <a className="text-link" href={phoneHref}>{branch.phone}</a>}
              {branch.phone && action === phoneHref && <span className="contact-phone">{branch.phone}</span>}
              {salon.slug === 'zerkalo' && <a className="text-link" href="https://t.me/+79230194638">Telegram</a>}
              {salon.slug === 'karina-meyskaya' && <a className="text-link" href="https://t.me/+79330269666">Telegram</a>}
            </div>
            <a className="text-link route-link" href={routeFor(branch)} target="_blank" rel="noreferrer">
              Построить маршрут в 2ГИС<ArrowUpRight size={17} />
            </a>
          </div>
          <iframe key={branch.id} className="contact-map" src={widgetFor(branch)} title={`Карта 2ГИС · ${branch.address}`}
            loading="lazy" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" />
        </section>
      </main>

      <footer>
        <a className="wordmark" href="#main">{salon.name}</a>
        <p>Красноярск</p>
        <a href="#contacts">Адрес и контакты <ArrowRight size={16} /></a>
      </footer>
      <a className="mobile-book button" href={primary}>{primaryLabel}<ArrowUpRight size={18} /></a>
    </div>
  );
}
