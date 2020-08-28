import { RedisOptions } from 'ioredis';

interface ICacheConfig {
	driver: 'redis';

	config: {
		redis: RedisOptions;
	};
}

const cacheConfig: ICacheConfig = {
	driver: process.env.CACHE_DRIVER || 'redis',

	config: {
		redis: {
			host: 'localhost',
			port: 6379,
			password: undefined,
		},
	},
};

export default cacheConfig;
