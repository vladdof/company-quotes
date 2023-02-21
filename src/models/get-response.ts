interface IStocks {
  image: string;
  companyName: string;
  price: string;
  symbol: string;
};


export type GetStocksResponse = {
  data: IStocks[];
}
