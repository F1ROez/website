const image = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=78&w=1440`;

export const images = [
  '1641252064345-235d409679eb',
  '1522335789203-aabd1fc54bc9',
  '1526045478516-99145907023c',
  '1519699047748-de8e457a634e',
  '1515372039744-b8f02a3ae446',
  '1706629505300-168aa1604912',
  '1488426862026-3ee34a7d66df',
  '1781450090585-1a511b7066d9',
  '1515886657613-9f3515b0c78f',
  '1487412947147-5cebf100ffc2',
].map(image);

export const detailImages = [
  '1634449571010-02389ed0f9b0',
  '1701976333339-1d41dad8138b',
  '1647462741268-e5724e5886c0',
  '1524504388940-b1c1722653e1',
  '1524250502761-1ac6f2e30d43',
  '1517841905240-472988babdf9',
  '1723879371709-17908244d70a',
  '1675034743339-0b0747047727',
  '1675034741621-79a7d07c1369',
  '1637777277435-3c44f82fd0c9',
].map(image);

export function photoAtWidth(url: string) {
  return [480, 800, 1120, 1440].map((width) => `${url.replace(/&w=\d+$/, `&w=${width}`)} ${width}w`).join(', ');
}
