class StorageService {
  _storage;
  constructor(storage) {
    if (!storage || !(storage instanceof Storage)) {
      throw new Error(
        'storage arg is not an instance of the Storage or undefined',
      );
    }
    this._storage = storage;
  }

  get(key) {
    return JSON.parse(this._storage.getItem(key));
  }

  set(key, value) {
    this._storage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    this._storage.removeItem(key);
  }

  clear() {
    this._storage.clear();
  }
}

export class StockService extends StorageService {
  static KEY = 'stock';

  constructor() {
    super(localStorage);
  }

  get(symbol) {
    return super.get(`${StockService.KEY}-${symbol}`);
  }

  set(symbol, stock) {
    super.set(`${StockService.KEY}-${symbol}`, stock);
  }

  clear() {
    super.clear();
  }
}
