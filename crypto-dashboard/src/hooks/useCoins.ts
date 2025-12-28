import {useQuery} from '@tanstack/react-query';
import { coinService } from '../services/CoinService';
import type { Coin } from '../types/coin';

export const useCoins = () => {
    return useQuery<Coin[]>({
        queryKey: ['coins'],
        queryFn: () => coinService.getCoins(),
        staleTime: 60000,
        refetchInterval: 60000
    });
};