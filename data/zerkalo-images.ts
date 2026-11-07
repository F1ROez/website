import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const publicDir = join(process.cwd(), 'public');
const heroPath = '/images/hero-02.webp';
const hairLead = ['13.webp', '15.webp', '27.webp'];

const captions: Record<'hair' | 'nails', Record<string, string>> = {
  hair: {
    '01.webp': 'Светлые волосы до плеч с мягкой линией среза',
    '02.webp': 'Прямые светлые волосы с ровным срезом',
    '03.webp': 'Длинные каштановые волосы с плавной линией среза',
    '04.webp': 'Стрижка на светлых волосах средней длины',
    '05.webp': 'Светлое каре с удлинёнными прядями у лица',
    '06.webp': 'Короткая объёмная стрижка с выбритым виском',
    '07.webp': 'Прямые светлые волосы с ровными концами, вид сзади',
    '08.webp': 'Короткая стрижка на светлых волосах, вид сбоку',
    '09.webp': 'Многослойная короткая стрижка на светлых волосах',
    '10.webp': 'Длинные прямые светлые волосы после окрашивания',
    '11.webp': 'Стрижка слоями на светло-русых волосах',
    '12.webp': 'Короткая мужская стрижка с плавным переходом',
    '13.webp': 'Длинные светлые волосы, вид сбоку в зеркале',
    '14.webp': 'Стрижка средней длины с уложенными наружу концами',
    '15.webp': 'Длинные тёмные волосы с чёлкой и прядями у лица',
    '16.webp': 'Длинные светлые волосы, вид спереди в зеркале',
    '17.webp': 'Короткая стрижка на светлых волосах, вид сверху',
    '19.webp': 'Каре на светло-русых волосах, вид сбоку',
    '20.webp': 'Короткая многослойная стрижка, вид сзади',
    '21.webp': 'Детская стрижка, вид сбоку',
    '23.webp': 'Светло-русые волосы после работы мастера',
    '24.webp': 'Прямой срез на светлых волосах, вид под углом',
    '25.webp': 'Короткая стрижка на пепельно-светлых волосах',
    '26.webp': 'Многослойная стрижка на седых волосах',
    '27.webp': 'Тёмные волосы с удлинёнными прядями у лица',
    '28.webp': 'Детская короткая стрижка, вид сзади',
    '29.webp': 'Мастер завершает короткую стрижку машинкой',
  },
  nails: {
    '01.webp': 'Квадратные ногти с глянцевым бордовым покрытием',
    '02.webp': 'Маникюр с розовым покрытием и серебристыми кончиками',
    '03.webp': 'Голубой маникюр с мраморным акцентом',
    '04.webp': 'Светлый маникюр рядом с красной розой',
    '05.webp': 'Красный маникюр с глянцевым покрытием',
    '06.webp': 'Педикюр со светлым покрытием',
    '07.webp': 'Квадратные ногти с зелёным покрытием',
    '08.webp': 'Тёмный маникюр с металлическими линиями',
    '09.webp': 'Маникюр с нюдовым покрытием',
    '10.webp': 'Нюдовый маникюр с чёрной окантовкой',
    '11.webp': 'Короткие ногти с глянцевым красным покрытием',
    '12.webp': 'Нюдовый маникюр на коротких ногтях',
    '13.webp': 'Матовый маникюр насыщенного синего цвета',
    '14.webp': 'Бежевый маникюр с рисунком в виде сердца',
    '15.webp': 'Ярко-красное покрытие на коротких ногтях',
    '16.webp': 'Розовый маникюр с рисунком и глянцем',
    '17.webp': 'Глянцевый светло-розовый маникюр',
    '18.webp': 'Тёмный педикюр с мерцающим покрытием',
    '20.webp': 'Красный маникюр с овальной формой ногтей',
    '21.webp': 'Светлый маникюр с чёрными кончиками',
    '22.webp': 'Голубой маникюр с прозрачными блестящими кончиками',
    '23.webp': 'Короткие ногти с бордовым покрытием',
    '24.webp': 'Светлые ногти с красным рисунком',
    '25.webp': 'Красный маникюр с чёрно-белым акцентом',
    '26.webp': 'Матовый светло-розовый маникюр',
    '27.webp': 'Маникюр с ярким покрытием в фиолетовом свете',
    '28.webp': 'Педикюр с жёлтым покрытием',
  },
};

export function zerkaloHero() {
  return existsSync(join(publicDir, heroPath)) ? basePath + heroPath : undefined;
}

export function zerkaloContactEye() {
  const path = '/images/contact-eye.webp';
  return existsSync(join(publicDir, path)) ? basePath + path : undefined;
}

export function zerkaloServicesPhoto() {
  const path = '/images/services-interior.webp';
  return existsSync(join(publicDir, path)) ? basePath + path : undefined;
}

export function zerkaloShareImage() {
  const hero = zerkaloHero();
  return hero && process.env.SITE_URL ? new URL(hero, process.env.SITE_URL).href : hero;
}

export function zerkaloWorks(category: 'hair' | 'nails') {
  const path = `/images/works/${category}/`;
  const directory = join(publicDir, path);
  if (!existsSync(directory)) return [];
  const files = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(webp|jpe?g|png|avif)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }));
  const ordered = category === 'hair'
    ? [...hairLead.filter((name) => files.includes(name)), ...files.filter((name) => !hairLead.includes(name))]
    : files;
  return ordered.map((name, index) => ({
    src: basePath + path + encodeURIComponent(name),
    alt: captions[category][name] ?? `Работа студии, фото ${index + 1}`,
  }));
}
