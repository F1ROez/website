import './globals.css';
import "./salon.css";
export const metadata={title:'Салоны красоты · Красноярск',description:'Услуги, адреса и запись в салоны красоты Красноярска'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
