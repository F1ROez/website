import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const publicDir = join(process.cwd(), 'public');
const heroPath = '/images/hero-02.webp';

const captions: Record<'hair' | 'nails', Record<string, string>> = {
  hair: {
    '01.webp': 'Светлые волосы до плеч с мягкой линией среза',
    '02.webp': 'Прямые светлые волосы с ровным срезом',
    '03.webp': 'Длинные каштановые волосы с плавной линией среза',
    '04.webp': 'Стрижка на светлых волосах средней длины',
  },
  nails: {
    '01.webp': 'Квадратные ногти с глянцевым бордовым покрытием',
    '02.webp': 'Маникюр с розовым покрытием и серебристыми кончиками',
  },
};

export function zerkaloHero() {
  return existsSync(join(publicDir, heroPath)) ? basePath + heroPath : undefined;
}

export function zerkaloShareImage() {
  const hero = zerkaloHero();
  return hero && process.env.SITE_URL ? new URL(hero, process.env.SITE_URL).href : hero;
}

export function zerkaloWorks(category: 'hair' | 'nails') {
  const path = `/images/works/${category}/`;
  const directory = join(publicDir, path);
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(webp|jpe?g|png|avif)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }))
    .map((name, index) => ({
      src: basePath + path + encodeURIComponent(name),
      alt: captions[category][name] ?? `Работа студии, фото ${index + 1}`,
    }));
}
