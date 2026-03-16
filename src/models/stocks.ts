export interface IStocks {
  image: string;
  companyName: string;
  price: string;
  symbol: string;
  description?: string;
  website?: string;
  industry?: string;
  sector?: string;
  exchange?: string;
  currency?: string;
  changes?: number;
  changesPercentage?: number;
  country?: string;
  ceo?: string;
  mktCap?: number;
  marketCap?: number;
  fullTimeEmployees?: string;
  sparkline?: number[];
};

export interface INews {
  title: string;
  url: string;
  publishedDate: string;
  image?: string;
  site?: string;
  text?: string;
  symbol?: string;
}

