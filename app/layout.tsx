import './globals.css';
import "./salon.css";
export const metadata={title:'Коллекция салонов · Красноярск',description:'Десять демонстрационных сайтов салонов Красноярска'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
