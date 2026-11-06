import { notFound } from 'next/navigation';
import SalonPage from '../../components/SalonPage';
import { images } from '../../data/images';
import { salons } from '../../data/salons';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const active = salons.filter(({ slug }) => !process.env.SALON_SLUG || slug === process.env.SALON_SLUG);
  return active.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const index = salons.findIndex((salon) => salon.slug === slug);
  const salon = salons[index];
  if (!salon) notFound();
  return {
    title: `${salon.name} · Красноярск`,
    description: salon.description,
    openGraph: { title: salon.name, description: salon.description, images: [images[index]] },
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const index = salons.findIndex((salon) => salon.slug === slug);
  if (index < 0) notFound();
  return <SalonPage salon={salons[index]} index={index} />;
}
