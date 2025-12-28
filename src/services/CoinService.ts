import { HttpService } from "./HttpService"
import { httpClient } from "./httpClient";
import type { Coin } from '../types/coin';

export class CoinService extends HttpService {
    constructor() {
        super(httpClient);
    }

    async getCoins(): Promise<Coin[]> {
        return this.get<Coin[]>(
            '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
    }
}

export const coinService = new CoinService();

