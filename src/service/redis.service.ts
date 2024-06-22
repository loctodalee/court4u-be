export const acquireLock = async (slotId: string) => {
  const key = `lock_v2024_${slotId}`;
  const retryTime = 10;
  const expiredTime = 3000;
};
