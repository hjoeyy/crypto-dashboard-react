import {httpClient} from './httpClient';

export class HttpService {
    protected client;
    
    constructor(client = httpClient) {
        this.client = client;
    }

    async get<T>(url: string, config = {}): Promise<T> {
        try {
            const {data} = await this.client.get<T>(url, config);
            return data;
        } catch (error) {
            console.error('API Error: ', error);
            throw error;
        }
    }
}