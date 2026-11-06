'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Hand, Maximize2, Menu, Plus, X } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { PriceGroup } from '../data/zerkalo-prices';

const links = [
  ['Главная', '#main'],
  ['Контакты', '#contacts'],
  ['Услуги и цены', '#services'],
  ['Портфолио', '#works'],
];

export function Navigation({ name, booking }: { name: string; booking: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  return (
    <header className="zk-header" onKeyDown={(event) => {
      if (open && event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    }}>
      <a className="zk-brand" href="#main" onClick={() => setOpen(false)}>{name}</a>
      <nav id="zk-nav" className={open ? 'zk-nav is-open' : 'zk-nav'} aria-label="Основная навигация">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="zk-mobile-book" href={booking}>Записаться <ArrowUpRight size={17} /></a>
      </nav>
      <a className="zk-header-book" href={booking}>Записаться <ArrowUpRight size={16} /></a>
      <button className="zk-menu" type="button" ref={toggle} aria-expanded={open} aria-controls="zk-nav"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

export function HeroBackdrop({ src }: { src?: string }) {
  const target = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <div className={src ? 'zk-backdrop has-photo' : 'zk-backdrop'} ref={target} aria-hidden="true">
      <motion.div className="zk-backdrop-layer" style={reduce ? undefined : { y }}>
        {src ? <img src={src} alt="" fetchPriority="high" /> :
          <div className="zk-mirror"><span /><span /><span /></div>}
      </motion.div>
    </div>
  );
}

export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: .75, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .13 }}
      transition={{ duration: .65, ease: [0.2, 0.65, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export function PriceAccordion({ groups }: { groups: PriceGroup[] }) {
  const [open, setOpen] = useState<string[]>([]);

  return (
    <div className="zk-price-stack">
      {groups.map(({ id, title, items }, index) => {
        const expanded = open.includes(id);
        const buttonId = `zk-price-${id}`;
        const panelId = `${buttonId}-panel`;
        return (
          <div className="zk-price-group" data-open={expanded} key={id}>
            <h3>
              <button id={buttonId} type="button" aria-expanded={expanded} aria-controls={panelId}
                onClick={() => setOpen((current) => expanded ? current.filter((entry) => entry !== id) : [...current, id])}>
                <span className="zk-price-number zk-kicker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="zk-price-label">{title}</span>
                <span className="zk-plus" aria-hidden="true"><Plus size={19} /></span>
              </button>
            </h3>
            <div id={panelId} className="zk-price-panel" inert={!expanded}>
              <ul aria-labelledby={buttonId}>
                {items.map(([name, price], row) => (
                  <li key={name} style={{ '--row-delay': `${Math.min(row, 5) * 21}ms` } as CSSProperties}>
                    <span>{name}</span>
                    <span className="zk-price-value">{price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type MouseDrag = {
  pointer: number;
  x: number;
  left: number;
  moved: boolean;
  samples: Array<{ x: number; time: number }>;
};

export function WorksGallery({ category, label, number, images }: {
  category: 'hair' | 'nails';
  label: string;
  number: string;
  images: Array<{ src: string; alt: string }>;
}) {
  const track = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const drag = useRef<MouseDrag | null>(null);
  const dragged = useRef(false);
  const inertia = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });
  const [selected, setSelected] = useState(0);
  const total = images.length;
  const id = `zk-gallery-${category}`;

  useEffect(() => {
    const element = track.current;
    if (!element) return;

    const sync = () => {
      const start = element.scrollLeft < 2;
      const end = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2;
      setEdges((previous) => previous.start === start && previous.end === end ? previous : { start, end });
    };

    sync();
    const resize = new ResizeObserver(sync);
    resize.observe(element);
    element.addEventListener('scroll', sync, { passive: true });
    return () => {
      if (inertia.current !== null) cancelAnimationFrame(inertia.current);
      resize.disconnect();
      element.removeEventListener('scroll', sync);
    };
  }, [total]);

  function stopInertia() {
    if (inertia.current === null) return;
    cancelAnimationFrame(inertia.current);
    inertia.current = null;
  }

  function scroll(direction: number) {
    stopInertia();
    const element = track.current;
    if (!element) return;
    const [first, second] = element.children as HTMLCollectionOf<HTMLElement>;
    if (!first || !second) return;
    const step = second.offsetLeft - first.offsetLeft;
    if (!step) return;
    element.scrollBy({ left: direction * step, behavior: reduce ? 'instant' : 'smooth' });
  }

  function stepPhoto(direction: number) {
    setSelected((current) => (current + direction + total) % total);
  }

  function startDrag(event: PointerEvent<HTMLUListElement>) {
    stopInertia();
    dragged.current = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const element = event.currentTarget;
    if (element.scrollWidth <= element.clientWidth) return;
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      left: element.scrollLeft,
      moved: false,
      samples: [{ x: event.clientX, time: event.timeStamp }],
    };
  }

  function stopDrag(event: PointerEvent<HTMLUListElement>) {
    if (drag.current?.pointer !== event.pointerId) return;
    drag.current = null;
    event.currentTarget.classList.remove('is-dragging');
  }

  function releaseDrag(event: PointerEvent<HTMLUListElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const element = event.currentTarget;
    stopDrag(event);
    if (!gesture.moved || reduce) return;

    const first = gesture.samples[0];
    const last = gesture.samples[gesture.samples.length - 1];
    if (event.timeStamp - last.time > 90) return;
    const speed = (first.x - last.x) / Math.max(16, event.timeStamp - first.time);
    let velocity = Math.max(-3.2, Math.min(3.2, speed));
    let position = element.scrollLeft;
    let previousTime = performance.now();
    const decayTime = 245;

    function glide(time: number) {
      const elapsed = Math.min(32, Math.max(0, time - previousTime));
      const decay = Math.exp(-elapsed / decayTime);
      const limit = element.scrollWidth - element.clientWidth;
      position = Math.max(0, Math.min(limit, position + velocity * decayTime * (1 - decay)));
      element.scrollLeft = position;
      velocity *= decay;
      previousTime = time;
      inertia.current = position > 0 && position < limit && Math.abs(velocity) > .025
        ? requestAnimationFrame(glide)
        : null;
    }

    if (Math.abs(velocity) > .025) inertia.current = requestAnimationFrame(glide);
  }

  function moveDrag(event: PointerEvent<HTMLUListElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    if (!(event.buttons & 1)) {
      stopDrag(event);
      return;
    }
    const distance = event.clientX - gesture.x;
    if (!gesture.moved && Math.abs(distance) < 7) return;
    const element = event.currentTarget;
    if (!gesture.moved) {
      gesture.moved = true;
      dragged.current = true;
      element.setPointerCapture(event.pointerId);
      element.classList.add('is-dragging');
    }
    element.scrollLeft = gesture.left - distance;
    gesture.samples.push({ x: event.clientX, time: event.timeStamp });
    while (gesture.samples.length > 2 && event.timeStamp - gesture.samples[1].time > 105) {
      gesture.samples.shift();
    }
  }

  return (
    <div className="zk-gallery" aria-labelledby={id}>
      <Reveal className="zk-wrap zk-gallery-head">
        <span className="zk-kicker" aria-hidden="true">{number} /</span>
        <h3 id={id}>{label}</h3>
        {total > 0 ? <div className="zk-gallery-arrows" role="group" aria-label={`Прокрутка галереи «${label}»`}>
          <span className="zk-gallery-hint"><Hand size={15} aria-hidden="true" /> Листайте · {total} фото</span>
          <button type="button" aria-label="Прокрутить влево" aria-controls={`${id}-track`} disabled={edges.start} onClick={() => scroll(-1)}>
            <ArrowLeft size={19} />
          </button>
          <button type="button" aria-label="Прокрутить вправо" aria-controls={`${id}-track`} disabled={edges.end} onClick={() => scroll(1)}>
            <ArrowRight size={19} />
          </button>
        </div> : <p className="zk-gallery-note">Фото для этой подборки пока не добавлены</p>}
      </Reveal>
      {total > 0 && (
        <>
          <ul className="zk-track" id={`${id}-track`} ref={track}
            onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={releaseDrag}
            onPointerCancel={stopDrag} onLostPointerCapture={stopDrag}
            onPointerLeave={(event) => { if (!drag.current?.moved) stopDrag(event); }}
            onWheel={stopInertia} onKeyDown={stopInertia}
            onDragStart={(event) => event.preventDefault()}
            onClickCapture={(event) => {
              if (event.detail > 0 && dragged.current) {
                dragged.current = false;
                event.stopPropagation();
              }
            }}>
            {images.map(({ src, alt }, index) => (
              <li key={src}>
                <button type="button" aria-label={`${label} · открыть фото ${index + 1} из ${total}`}
                  onClick={() => {
                    setSelected(index);
                    dialog.current?.showModal();
                    closeButton.current?.focus();
                  }}>
                  <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} />
                  <span className="zk-expand" aria-hidden="true"><Maximize2 size={17} /></span>
                </button>
                <span className="zk-kicker" aria-hidden="true">Zerkalo / {String(index + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ul>
          <dialog className="zk-lightbox" ref={dialog} aria-label={`Галерея «${label}»`}
            onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
            onKeyDown={(event) => {
              if (total < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
              event.preventDefault();
              stepPhoto(event.key === 'ArrowLeft' ? -1 : 1);
            }}>
            <button className="zk-light-close" ref={closeButton} type="button" aria-label="Закрыть галерею"
              onClick={() => dialog.current?.close()}><X size={23} /></button>
            <figure onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
              onTouchEnd={(event) => {
                if (touchStart.current === null) return;
                const distance = event.changedTouches[0].clientX - touchStart.current;
                touchStart.current = null;
                if (total > 1 && Math.abs(distance) > 48) stepPhoto(distance > 0 ? -1 : 1);
              }}
              onTouchCancel={() => { touchStart.current = null; }}>
              <img key={images[selected].src} src={images[selected].src} alt={images[selected].alt} loading="lazy" />
              <figcaption aria-live="polite">{label} / {selected + 1} из {total}</figcaption>
            </figure>
            {total > 1 && <div className="zk-light-arrows">
              <button type="button" aria-label="Предыдущее фото" onClick={() => stepPhoto(-1)}><ArrowLeft size={21} /></button>
              <button type="button" aria-label="Следующее фото" onClick={() => stepPhoto(1)}><ArrowRight size={21} /></button>
            </div>}
          </dialog>
        </>
      )}
    </div>
  );
}
