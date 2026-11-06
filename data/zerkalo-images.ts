import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const publicDir = join(process.cwd(), 'public');
const heroPath = '/images/hero-02.webp';

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
    .map((name) => basePath + path + encodeURIComponent(name));
}
