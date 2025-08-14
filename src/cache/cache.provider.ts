import { createClient } from 'redis';

export const CacheProvider = {
  provide: 'REDIS_STORAGE',
  useFactory: async () => {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', (err) => {
      console.error('Cache error: ', err);
    });

    await client.connect();

    return client;
  },
};
