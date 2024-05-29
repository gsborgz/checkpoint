import Cryptr from 'cryptr';

export default new Cryptr(process.env.NEXT_PUBLIC_CRYPTR_SECRET);
