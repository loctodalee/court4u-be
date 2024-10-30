import { promisify } from 'util';
import { BadRequestError } from '../handleResponse/error.response';
import { getRedis } from '../lib/init.redis';

const { instanceConnect: redisClient } = getRedis();
if (!redisClient) {
  throw new BadRequestError('Error initialize redis');
}

export const deleteKeysByPattern = (pattern: string) => {
  var stream = redisClient.scanStream({
    match: `${pattern}*`,
  });
  stream.on('data', function (keys) {
    if (keys.length) {
      var pipeline = redisClient.pipeline();
      keys.forEach(function (key: any) {
        pipeline.del(key);
      });
      pipeline.exec();
    }
  });
  stream.on('end', function () {
    console.log('done');
  });
};
