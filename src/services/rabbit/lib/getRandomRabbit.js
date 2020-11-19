import { getRandomInt } from '@homamo/meadow-utils';

import Logger from '../../../loaders/logger';
import countRabbits from './countRabbits';
import findRabbits from './findRabbits';

export default async () => {
  try {
    Logger.debug('[findRandomRabbit] Finding random rabbit...');

    const rabbitCount = await countRabbits({ filter: {} }).catch(e => {
      throw new Error(e);
    });

    const rabbit = await findRabbits({
      pageSize: 1,
      pageIndex: getRandomInt(rabbitCount),
    }).catch(e => {
      throw new Error(e);
    });

    return rabbit;
  } catch (exception) {
    throw new Error(`[getRandomRabbit] ${exception.message}`);
  }
};
