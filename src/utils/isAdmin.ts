import { MD5 } from 'crypto-js';
import { HASHED_KEY, SESSION_STORAGE_NAME } from '@/constants';

export const isAdmin = (): boolean => {
  const key = sessionStorage.getItem(SESSION_STORAGE_NAME);
  const hash = key ? MD5(key).toString() : '';
  return hash === HASHED_KEY;
};
