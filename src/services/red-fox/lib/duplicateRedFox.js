import RedFox from '../../../models/RedFox';
import Logger from '../../../loaders/logger';
import findRedFox from './findRedFox';

const fieldsExemptFromDuplication = ['_id', 'createdAt', 'updatedAt', '__v'];

const createRedFoxOnDatabase = async ({
  originalRedFox,
  update,
  currentUserId,
}) => {
  try {
    Logger.debug(
      '[duplicateRedFox.createRedFoxOnDatabase] Creating RedFox on database...',
    );

    const redFoxData = {
      ...originalRedFox,
      ...update,
      owner: currentUserId,
    };

    const redFox = await RedFox.create(redFoxData).catch((e) => {
      throw new Error(e);
    });

    Logger.debug(
      `[duplicateRedFox.createRedFoxOnDatabase] RedFox ${redFox._id} created on database.`,
    );
    return redFox;
  } catch (exception) {
    throw new Error(
      `[duplicateRedFox.createRedFoxOnDatabase] ${exception.message}`,
    );
  }
};

const getCleanRedFoxData = async ({ redFoxId }) => {
  try {
    Logger.debug(
      `[duplicateRedFox.getCleanRedFoxData] Getting original RedFox: ${redFoxId}`,
    );

    const originalRedFox = await findRedFox({ filter: { _id: redFoxId } });
    // eslint-disable-next-line no-underscore-dangle
    const originalRedFoxData = originalRedFox && originalRedFox._doc;

    Logger.debug(
      '[duplicateRedFox.getCleanRedFoxData] Cleaning original RedFox data',
    );

    fieldsExemptFromDuplication.forEach((field) => {
      Reflect.deleteProperty(originalRedFoxData, field);
      Logger.debug(`[duplicateRedFox.getCleanRedFoxData] Removed ${field}`);
    });

    Logger.debug(
      '[duplicateRedFox.getCleanRedFoxData] Returning clean original RedFox data',
    );
    return originalRedFoxData;
  } catch (exception) {
    throw new Error(
      `[duplicateRedFox.getCleanRedFoxData] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[duplicateRedFox.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.id) throw new Error('options.id is required.');
    if (!options.currentUserId)
      throw new Error('options.currentUserId is required.');

    Logger.debug(
      '[duplicateRedFox.validateOptions] Validating options passed.',
    );
  } catch (exception) {
    throw new Error(`[duplicateRedFox.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const { id, update, currentUserId } = options;
    const redFoxToDuplicateId = id;
    const originalRedFox = await getCleanRedFoxData({
      redFoxId: redFoxToDuplicateId,
    });
    const { _id } = await createRedFoxOnDatabase({
      originalRedFox,
      update,
      currentUserId,
    });
    const redFox = await findRedFox({ filter: { _id } });
    return redFox;
  } catch (exception) {
    throw new Error(`[duplicateRedFox] ${exception.message}`);
  }
};
