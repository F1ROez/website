import {salons} from '../../data/salons';import SalonPage from '../../components/SalonPage';import {notFound} from 'next/navigation';
export function generateStaticParams(){return salons.map(s=>({slug:s.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=salons.find(s=>s.slug===slug);return {title:`${s?.name} · Красноярск`,description:s?.description,openGraph:{title:s?.name,description:s?.description}}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=salons.find(s=>s.slug===slug);if(!s)notFound();return <SalonPage salon={s} index={salons.indexOf(s)}/>}
