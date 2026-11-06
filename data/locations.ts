import { salons } from './salons';

type Location = {
  id: string;
  address: string;
  short?: string;
  contact?: string;
  action?: string;
  phone?: string;
  hours?: string;
  coordinates: string;
  rating: readonly [score: number, count: number];
};

const coordinates = {
  parus: '92.903361,55.999471',
  bog: '92.83792,56.006347',
  ok: '92.922221,56.035397',
  yar: '92.864538,55.988363',
  amb: '92.911521,56.043404',
  rub: '92.847282,56.012066',
  mirrors: '92.921633,56.048578',
  suns: '92.825597,56.020977',
  lomako: '92.892982,56.052976',
  nav: '92.900575,55.997686',
  ak: '92.77507,55.987127',
  karina: '92.91491,56.04164',
  seasons: '92.878793,56.01312',
  t: '92.86792,55.984843',
  zerkalo: '92.892982,56.052976',
};

type MapKey = keyof typeof coordinates;

// Ratings and counts from the 2GIS organization cards, checked 2026-11-06.
const ratings: Record<string, Location['rating']> = {
  '70000001042614977': [5, 310], // Like Me · Парусная
  '70000001057575162': [5, 116], // Like Me · Бограда
  '70000001117206119': [5, 2],   // Like Me · Октябрьская
  '70000001061494710': [5, 115], // Like Me · Ярыгинская
  '70000001024589215': [4.9, 214], // Амбассадор
  '70000001029479193': [4.9, 64],  // Рублёва
  '70000001080543192': [4.9, 98],  // Зеркала
  '985690699670006': [5, 607],     // Четыре Солнца
  '70000001032935617': [5, 331], // YEStwoBEAUTY · Петра Ломако
  '70000001046450540': [5, 403], // YEStwoBEAUTY · Навигационная
  '70000001057846207': [5, 250], // YEStwoBEAUTY · Академгородок
  '70000001063781448': [4.9, 110], // Карина Мейская
  '985690699467301': [4.9, 364],   // 4 сезона
  '70000001044113319': [4.9, 182], // T-Студио
  '70000001088827266': [5, 99],    // Zerkalo
};

function location(key: MapKey, id: string, address: string, details: Partial<Location> = {}): Location {
  return { id, address, coordinates: coordinates[key], rating: ratings[id], ...details };
}

const mainKeys: MapKey[] = ['parus', 'amb', 'rub', 'mirrors', 'suns', 'lomako', 'karina', 'seasons', 't', 'zerkalo'];

export const locations: Record<string, Location[]> = Object.fromEntries(
  salons.map((salon, index) => [salon.slug, [location(mainKeys[index], salon.id, salon.address)]]),
);

const likePhone = '+7 (391) 231-18-11';
const likeDetails = { phone: likePhone, hours: 'ежедневно 10:00–22:00' };
const likeBooking = (company: string) => `https://n673755.yclients.com/company/${company}/personal/select-services?o=`;
locations['like-me'] = [
  { ...locations['like-me'][0], ...likeDetails, short: 'Парусная, 7', contact: likeBooking('266573') },
  location('bog', '70000001057575162', 'улица Бограда, 130', { ...likeDetails, short: 'Бограда, 130', contact: likeBooking('600542') }),
  location('ok', '70000001117206119', 'Октябрьская улица, 4', { ...likeDetails, short: 'Октябрьская, 4', contact: 'tel:+73912311811', action: 'Позвонить для записи' }),
  location('yar', '70000001061494710', 'Ярыгинская набережная, 11', { ...likeDetails, phone: '+7 (929) 335-44-85', short: 'Ярыгинская, 11', contact: likeBooking('696745') }),
];

const yesDetails = { hours: 'ежедневно 09:00–21:00', phone: '+7 (391) 286-60-00' };
const yesBooking = (company: string) => `https://b137695.yclients.com/company/${company}/personal/menu?o=`;
locations.yestwobeauty = [
  { ...locations.yestwobeauty[0], ...yesDetails, short: 'Преображенский', contact: yesBooking('145454') },
  location('nav', '70000001046450540', 'Навигационная улица, 7', { ...yesDetails, short: 'Южный берег', contact: yesBooking('390302') }),
  location('ak', '70000001057846207', 'улица Академгородок, 66', { ...yesDetails, short: 'Академгородок', contact: yesBooking('628391') }),
];

locations['four-seasons'][0].phone = '+7 (391) 227-40-41';

locations.ambassador[0].phone = '+7 (391) 286-64-47';
locations.rubleva[0].phone = '+7 (903) 921-97-77';
locations['four-suns'][0].phone = '+7 (902) 990-56-54';

export function widgetFor(branch: Location) {
  const [lon, lat] = branch.coordinates.split(',').map(Number);
  const options = {
    pos: { lat, lon, zoom: 17 },
    opt: { city: 'krasnoyarsk' },
    org: branch.id,
  };
  return `https://widgets.2gis.com/widget?type=firmsonmap&options=${encodeURIComponent(JSON.stringify(options))}`;
}
