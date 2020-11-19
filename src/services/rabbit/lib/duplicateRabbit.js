import Rabbit from '../../../models/Rabbit';
import Logger from '../../../loaders/logger';
import findRabbit from './findRabbit';

const fieldsExemptFromDuplication = ['_id', 'createdAt', 'updatedAt', '__v'];

const createRabbitOnDatabase = async ({
  originalRabbit,
  update,
  currentUserId,
}) => {
  try {
    Logger.debug(
      '[duplicateRabbit.createRabbitOnDatabase] Creating rabbit on database...',
    );

    const rabbitData = {
      ...originalRabbit,
      ...update,
      owner: currentUserId,
    };

    const rabbit = await Rabbit.create(rabbitData).catch(e => {
      throw new Error(e);
    });

    Logger.debug(
      `[duplicateRabbit.createRabbitOnDatabase] Rabbit ${rabbit._id} created on database.`,
    );
    return rabbit;
  } catch (exception) {
    throw new Error(
      `[duplicateRabbit.createRabbitOnDatabase] ${exception.message}`,
    );
  }
};

const getCleanRabbitData = async ({ rabbitId }) => {
  try {
    Logger.debug(
      `[duplicateRabbit.getCleanRabbitData] Getting original rabbit: ${rabbitId}`,
    );

    const originalRabbit = await findRabbit({ filter: { _id: rabbitId } });
    // eslint-disable-next-line no-underscore-dangle
    const originalRabbitData = originalRabbit && originalRabbit._doc;

    Logger.debug(
      '[duplicateRabbit.getCleanRabbitData] Cleaning original rabbit data',
    );

    fieldsExemptFromDuplication.forEach(field => {
      Reflect.deleteProperty(originalRabbitData, field);
      Logger.debug(`[duplicateRabbit.getCleanRabbitData] Removed ${field}`);
    });

    Logger.debug(
      '[duplicateRabbit.getCleanRabbitData] Returning clean original rabbit data',
    );
    return originalRabbitData;
  } catch (exception) {
    throw new Error(
      `[duplicateRabbit.getCleanRabbitData] ${exception.message}`,
    );
  }
};

const validateOptions = options => {
  try {
    Logger.debug('[duplicateRabbit.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.id) throw new Error('options.id is required.');
    if (!options.currentUserId)
      throw new Error('options.currentUserId is required.');

    Logger.debug(
      '[duplicateRabbit.validateOptions] Validating options passed.',
    );
  } catch (exception) {
    throw new Error(`[duplicateRabbit.validateOptions] ${exception.message}`);
  }
};

export default async options => {
  try {
    validateOptions(options);
    const { id, update, currentUserId } = options;
    const rabbitToDuplicateId = id;
    const originalRabbit = await getCleanRabbitData({
      rabbitId: rabbitToDuplicateId,
    });
    const { _id } = await createRabbitOnDatabase({
      originalRabbit,
      update,
      currentUserId,
    });
    const rabbit = await findRabbit({ filter: { _id } });
    return rabbit;
  } catch (exception) {
    throw new Error(`[duplicateRabbit] ${exception.message}`);
  }
};
