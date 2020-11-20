import RedFox from '../../../models/RedFox';
import Logger from '../../../loaders/logger';

const deleteRedFoxOnDatabase = async (redFoxId) => {
  try {
    Logger.debug(
      `[deleteRedFox.deleteRedFoxOnDatabase] Deleting RedFox ${redFoxId} on database...`,
    );

    const redFox = await RedFox.findByIdAndDelete(redFoxId).catch((e) => {
      throw new Error(e);
    });

    Logger.debug(
      `[deleteRedFox.deleteRedFoxOnDatabase] RedFox ${redFox._id} deleted on database.`,
    );
    return redFox;
  } catch (exception) {
    throw new Error(
      `[deleteRedFox.deleteRedFoxOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[deleteRedFox.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.id) throw new Error('options.id is required.');

    Logger.debug('[deleteRedFox.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[deleteRedFox.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const redFoxIdToDelete = options.id;
    const deletedRedFox = await deleteRedFoxOnDatabase(redFoxIdToDelete);
    return deletedRedFox.toObject();
  } catch (exception) {
    throw new Error(`[deleteRedFox] ${exception.message}`);
  }
};
