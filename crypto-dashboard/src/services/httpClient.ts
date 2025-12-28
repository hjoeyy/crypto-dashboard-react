import axios from 'axios';

export const httpClient = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    headers: {
        'Content-Type' : 'application/json',
    },
});