const { InternalServerError } = require('../handleResponse/error.response');
const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_URL } = process.env;
import redis, { Redis } from 'ioredis';
// import { createClient } from 'redis';
interface RedisClient {
  // instanceConnect?: ReturnType<typeof redis.createClient>;
  instanceConnect?: redis;
}

let client: RedisClient = {};

// Define connection status constants
const statusConnectRedis = {
  READY: 'connect',
  END: 'end',
  RECONNECT: 'reconnecting',
  ERROR: 'error',
};

// Variable to store the connection timeout
let connectionTimeout: NodeJS.Timeout | undefined;

const REDIS_CONNECT_TIMEOUT = 10 * 1000;
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: 'Error at init redis',
};

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new InternalServerError({
      message: REDIS_CONNECT_MESSAGE.message,
      statusCode: REDIS_CONNECT_MESSAGE.code,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnect = (connectionRedis: Redis) => {
  connectionRedis.on(statusConnectRedis.READY, () => {
    console.log('connection redis - connection status: connected');
    if (connectionTimeout) clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log('connection redis - connection status: disconnected');
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log('connection redis - connection status: reconnecting');
    if (connectionTimeout) clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (error: any) => {
    console.log(`connection redis - connection status: error: ${error}`);
    handleTimeoutError();
  });
};

export const initRedis = async () => {
  try {
    const instanceRedis = new Redis(REDIS_URL as string);

    handleEventConnect(instanceRedis);
    client.instanceConnect = instanceRedis;
    console.log('Redis client initialized successfully');
  } catch (error: any) {
    console.error(`Failed to connect to Redis: ${error.message}`);
    handleTimeoutError();
  }
};

export const getRedis = () => {
  return client;
};

export const closeRedis = () => {};
