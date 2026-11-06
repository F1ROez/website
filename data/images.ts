import sources from './photo-sources.json';

type PhotoRole = 'hero' | 'detail';

export function salonPhoto(slug: string, role: PhotoRole) {
  const { alt } = sources[slug as keyof typeof sources][role];
  return { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/salon-photos/${slug}-${role}.webp`, alt };
}
