import Cryptr from 'cryptr';

export default new Cryptr(process.env.NEXT_CRYPTR_SECRET);
