import Rabbit from '../../../models/Rabbit';
import Logger from '../../../loaders/logger';
import findRabbit from './findRabbit';
import UserService from '../../user';

const addRabbitToOwner = async ({ rabbitId, ownerId, userService }) => {
  try {
    Logger.debug(
      `[createRabbit.addRabbitToOwner] Adding rabbit ${rabbitId} to owner ${ownerId}`,
    );

    const user = await userService
      .Update({
        id: ownerId,
        update: { $push: { rabbit_ids: rabbitId } },
      })
      .catch((e) => {
        throw new Error(e);
      });

    return user;
  } catch (exception) {
    throw new Error(`[createRabbit.addRabbitToOwner] ${exception.message}`);
  }
};

const createRabbitOnDatabase = async ({
  title,
  status,
  cost,
  image,
  currentUserId,
  ownerId,
  createdSource,
}) => {
  try {
    Logger.debug(
      '[createRabbit.createRabbitOnDatabase] Creating rabbit on database...',
    );

    const rabbit = await Rabbit.create({
      title,
      status,
      cost,
      image,
      owner_id: ownerId || currentUserId,
      createdSource,
    }).catch((e) => {
      throw new Error(e);
    });

    Logger.debug(
      `[createRabbit.createRabbitOnDatabase] Rabbit ${rabbit._id} created on database.`,
    );
    return rabbit;
  } catch (exception) {
    throw new Error(
      `[createRabbit.createRabbitOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[createRabbit.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.title) throw new Error('options.title is required.');
    if (!options.currentUserId && !options.ownerId)
      throw new Error('options.currentUserId or options.ownerId is required.');

    Logger.debug('[createRabbit.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[createRabbit.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const userService = new UserService();
    const { _id } = await createRabbitOnDatabase(options);
    const rabbit = await findRabbit({ filter: { _id } });
    await addRabbitToOwner({
      rabbitId: rabbit._id,
      ownerId: rabbit.owner_id,
      userService,
    });
    return rabbit;
  } catch (exception) {
    throw new Error(`[createRabbit] ${exception.message}`);
  }
};
