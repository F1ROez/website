import { notFound } from 'next/navigation';
import SalonPage from '../../components/SalonPage';
import ZerkaloPage from '../../components/ZerkaloPage';
import { zerkaloShareImage } from '../../data/zerkalo-images';
import { salonPhoto } from '../../data/images';
import { salons } from '../../data/salons';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const active = salons.filter(({ slug }) => !process.env.SALON_SLUG || slug === process.env.SALON_SLUG);
  return active.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const salon = salons.find((item) => item.slug === slug);
  if (!salon) notFound();
  const isZerkalo = slug === 'zerkalo';
  const hero = isZerkalo ? zerkaloShareImage() : salonPhoto(slug, 'hero').src;
  return {
    title: `${salon.name} · Красноярск`,
    description: isZerkalo ? null : salon.description,
    openGraph: { title: salon.name, ...(!isZerkalo && { description: salon.description }), ...(hero ? { images: [hero] } : {}) },
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const index = salons.findIndex((salon) => salon.slug === slug);
  if (index < 0) notFound();
  if (slug === 'zerkalo') return <ZerkaloPage salon={salons[index]} />;
  return <SalonPage salon={salons[index]} index={index} />;
}
