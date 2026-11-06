import { createHash } from 'node:crypto';
import { access, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import sources from '../data/photo-sources.json' with { type: 'json' };

const root = new URL('../', import.meta.url);
const destination = new URL('public/salon-photos/', root);
const cache = new URL('.salon-photo-cache.json', root);
const previous = await readFile(cache, 'utf8').then(JSON.parse).catch(() => ({}));
const next = {};
await mkdir(destination, { recursive: true });
const temp = await mkdtemp(new URL('.salon-photo-build-', root));

const photos = Object.entries(sources).flatMap(([slug, group]) =>
  Object.entries(group).map(([role, { src }]) => ({ name: `${slug}-${role}.webp`, src })),
);

async function prepare({ name, src }) {
  const version = createHash('sha256').update(`webp:1280:82:${src}`).digest('hex');
  const output = new URL(name, destination);
  if (previous[name] === version && await access(output).then(() => true, () => false)) {
    next[name] = version;
    return;
  }

  let cause;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(src, { signal: AbortSignal.timeout(24000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const input = Buffer.from(await response.arrayBuffer());
      const stage = join(temp, name);
      await sharp(input).rotate().resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 82 }).toFile(stage);
      await rename(stage, output);
      next[name] = version;
      return;
    } catch (error) {
      cause = error;
    }
  }
  throw new Error(`Не удалось подготовить ${name} из ${src}`, { cause });
}

try {
  for (let i = 0; i < photos.length; i += 5) {
    const batch = await Promise.allSettled(photos.slice(i, i + 5).map(prepare));
    const failure = batch.find((result) => result.status === 'rejected');
    if (failure) throw failure.reason;
  }
  await writeFile(cache, JSON.stringify(next, null, 2) + '\n');
  console.log(`Подготовлено фотографий для сайта: ${photos.length}`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
