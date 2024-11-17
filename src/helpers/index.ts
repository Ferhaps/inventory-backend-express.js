import crypto from 'crypto';

export const random = () => crypto.randomBytes(128).toString('base64');

export const SECRET = 'INVENTORY_API_SECRET';

export const authentication = (salt: string, passord: string) => crypto.createHmac('sha256', [salt, passord]
  .join('/'))
  .update(SECRET).digest('hex');