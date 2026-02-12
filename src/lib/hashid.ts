import Hashids from 'hashids';
export const hashids = new Hashids(process.env.HASHID_SALT, 6);
