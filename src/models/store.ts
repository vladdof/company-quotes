import { INews } from './stocks';

export default interface IStore {
  stocks: object[];
  fx: string[];
  quote: object[];
  forex: {};
  isLoading: boolean;
  favorites: string[];
  theme: 'light' | 'dark';
  sortBy: 'name' | 'price' | 'change';
  sortDir: 'asc' | 'desc';
  news: INews[];
  isLoadingNews: boolean;
  pollingIntervalId: number | null;
}
