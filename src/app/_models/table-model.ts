export interface GpdPpcElement {
  stock: string;
  gpd: string;
  gpdColor: string;
  prc: string;
  prcColor: string;
  growth: string;
  dividend: string;
  pe: string;
  profit: string;
  roe: string;
  cash: string;
}

const SAMPLE_DATA: GpdPpcElement[] = [
  {
    stock: 'Maybank',
    gpd: 'PASS 36 Point',
    gpdColor: 'green',
    prc: 'FAIL 36 Point',
    prcColor: 'red',
    growth: '10%',
    dividend: '20%',
    pe: '20',
    profit: '20%',
    roe: '20%',
    cash: '盈利 Profit + 净流入 Positive Cash Flow'
  },
  {
    stock: 'Genm',
    gpd: 'FAIL 20 Point',
    gpdColor: 'red',
    prc: 'PASS 90 Point',
    prcColor: 'green',
    growth: '20%',
    dividend: '30%',
    pe: '10',
    profit: '40%',
    roe: '50%',
    cash: '盈利 Profit + 净流入 Positive Cash Flow'
  },
  {
    stock: 'Apple',
    gpd: 'PASS 36 Point',
    gpdColor: 'green',
    prc: 'PASS 52 Point',
    prcColor: 'green',
    growth: '30%',
    dividend: '40%',
    pe: '30',
    profit: '20%',
    roe: '20%',
    cash: '盈利 Profit + 净流入 Positive Cash Flow'
  }
];
