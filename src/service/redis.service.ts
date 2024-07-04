import { promisify } from 'util';
import { getRedis } from '../lib/init.redis';
import { SlotOnCourtService } from './slotOnCourt.service';
const { instanceConnect: redisClient } = getRedis();
if (!redisClient) {
  throw new Error('Redis is not initialize');
}
const pexpire = promisify(redisClient.pexpire).bind(redisClient) as (
  key: string,
  milliseconds: number
) => Promise<number>;
const setnxAsync = promisify(redisClient.setnx).bind(redisClient) as (
  key: string,
  value: string
) => Promise<number>;
const delAsyncKey = promisify(redisClient.del).bind(redisClient) as (
  key: string
) => Promise<number>;
export const acquireLock = async (
  slotId: string,
  date: Date,
  quantity: number
) => {
  const key = `lock__${slotId}`;
  const retryTime = 20; // chỗ này đang bí
  const expiredTime = 3000;
  for (let i = 0; i < retryTime; i++) {
    const result = await setnxAsync(key, 'lock');
    console.log(`result: ${result}`);
    if (result === 1) {
      const remain = await SlotOnCourtService.getInstance().getRemainCourt({
        slotId,
        date,
      });
      console.log(`Remaining courts: ${remain}`);
      if (remain >= quantity) {
        await pexpire(key, expiredTime);
        return key;
      }
      await delAsyncKey(key);
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

export const releaseLock = async (keylock: any) => {
  const result = await delAsyncKey(keylock);
  return result;
};
