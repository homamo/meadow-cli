import { getRandomInt } from '@homamo/meadow-utils';

import Logger from '../../../loaders/logger';
import countRedFoxes from './countRedFoxes';
import findRedFoxes from './findRedFoxes';

export default async () => {
  try {
    Logger.debug('[findRandomRedFox] Finding random RedFox...');

    const redFoxCount = await countRedFoxes({ filter: {} }).catch((e) => {
      throw new Error(e);
    });

    const redFox = await findRedFoxes({
      pageSize: 1,
      pageIndex: getRandomInt(redFoxCount),
    }).catch((e) => {
      throw new Error(e);
    });

    return redFox;
  } catch (exception) {
    throw new Error(`[getRandomRedFox] ${exception.message}`);
  }
};
