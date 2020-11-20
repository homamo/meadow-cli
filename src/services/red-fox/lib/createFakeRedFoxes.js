import faker from 'faker';
import { getRandomArrayValue } from '@homamo/meadow-utils';

import Logger from '../../../loaders/logger';
import createRedFox from './createRedFox';
import UserService from '../../user';
import redFoxStatuses from '../../../models/lib/redFoxStatuses';

const generateRedFoxObject = async ({ ownerId, status }) => {
  try {
    Logger.debug(
      '[createFakeRedFoxes.generateRedFoxObject] Generating RedFox details...',
    );

    const redFoxObject = {
      name: faker.random.word(),
      status: status || getRandomArrayValue(redFoxStatuses),
      createdSource: 'fake-red-foxes-generator',
    };

    if (!ownerId) {
      const userService = new UserService();
      const owner = await userService.Random();
      redFoxObject.ownerId = owner.data[0]._id;
    } else {
      redFoxObject.ownerId = ownerId;
    }

    return redFoxObject;
  } catch (exception) {
    throw new Error(
      `[createFakeRedFoxes.generateRedFoxObject] ${exception.message}`,
    );
  }
};

const createRedFoxes = async ({
  ownerId,
  status,
  numberOfRedFoxesToCreate,
}) => {
  try {
    Logger.debug(
      `[createFakeRedFoxes.createRedFoxes] Creating ${numberOfRedFoxesToCreate} fake RedFoxes...`,
    );

    const createRedFoxesPromises = [];
    for (let x = 0; x < numberOfRedFoxesToCreate; x += 1) {
      const createRedFoxPromise = generateRedFoxObject({ ownerId, status })
        .then((redFoxObject) => createRedFox(redFoxObject))
        .catch((e) => {
          throw new Error(e);
        });
      createRedFoxesPromises.push(createRedFoxPromise);
    }

    return Promise.all(createRedFoxesPromises);
  } catch (exception) {
    throw new Error(
      `[createFakeRedFoxcreateRedFoxOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[createFakeRedFoxvalidateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');

    Logger.debug(
      '[createFakeRedFox.validateOptions] Validating options passed.',
    );
  } catch (exception) {
    throw new Error(`[createFakeRedFoxvalidateOptions] ${exception.message}`);
  }
};

const checkDevEnv = () => {
  try {
    Logger.debug('[createFakeProperty.checkDevEnv] Checking environment...');

    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'createFakeProperty can only be used in development environment',
      );
    }
  } catch (exception) {
    throw new Error(`[createFakeProperty.checkDevEnv] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    checkDevEnv();
    validateOptions(options);
    const { ownerId, status, count } = options;
    const numberOfRedFoxesToCreate = count || 1;
    await createRedFoxes({ ownerId, status, numberOfRedFoxesToCreate });
    return { message: `${numberOfRedFoxesToCreate} fake RedFoxes created` };
  } catch (exception) {
    throw new Error(`[createRedFox] ${exception.message}`);
  }
};
