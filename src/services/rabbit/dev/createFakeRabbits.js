import faker from 'faker';
import { getRandomArrayValue } from '@homamo/meadow-utils';

import Logger from '../../../loaders/logger';
import createRabbit from '../lib/createRabbit';
import UserService from '../../user';
import rabbitStatuses from '../../../models/lib/rabbitStatuses';

const generateRabbitObject = async ({ ownerId, status }) => {
  try {
    Logger.debug(
      '[createFakeRabbits.generateRabbitObject] Generating rabbit details...',
    );

    const rabbitObject = {
      title: faker.random.word(),
      status: status || getRandomArrayValue(rabbitStatuses),
      createdSource: 'fake-rabbits-generator',
    };

    if (!ownerId) {
      const userService = new UserService();
      const owner = await userService.Random();
      rabbitObject.ownerId = owner.data[0]._id;
    } else {
      rabbitObject.ownerId = ownerId;
    }

    return rabbitObject;
  } catch (exception) {
    throw new Error(
      `[createFakeRabbits.generateRabbitObject] ${exception.message}`,
    );
  }
};

const createRabbits = async ({ ownerId, status, numberOfRabbitsToCreate }) => {
  try {
    Logger.debug(
      `[createFakeRabbits.createRabbits] Creating ${numberOfRabbitsToCreate} fake rabbits...`,
    );

    const createRabbitsPromises = [];
    for (let x = 0; x < numberOfRabbitsToCreate; x += 1) {
      const createRabbitPromise = generateRabbitObject({ ownerId, status })
        .then(rabbitObject => createRabbit(rabbitObject))
        .catch(e => {
          throw new Error(e);
        });
      createRabbitsPromises.push(createRabbitPromise);
    }

    return Promise.all(createRabbitsPromises);
  } catch (exception) {
    throw new Error(
      `[createFakeRabbitcreateRabbitOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = options => {
  try {
    Logger.debug('[createFakeRabbitvalidateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');

    Logger.debug(
      '[createFakeRabbit.validateOptions] Validating options passed.',
    );
  } catch (exception) {
    throw new Error(`[createFakeRabbitvalidateOptions] ${exception.message}`);
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

export default async options => {
  try {
    checkDevEnv();
    validateOptions(options);
    const { ownerId, status, count } = options;
    const numberOfRabbitsToCreate = count || 1;
    await createRabbits({ ownerId, status, numberOfRabbitsToCreate });
    return { message: `${numberOfRabbitsToCreate} fake rabbits created` };
  } catch (exception) {
    throw new Error(`[createRabbit] ${exception.message}`);
  }
};
