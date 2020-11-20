import RedFox from '../../../models/RedFox';
import Logger from '../../../loaders/logger';
import findRedFox from './findRedFox';

const updateRedFoxOnDatabase = async ({ redFoxId, update }) => {
  try {
    Logger.debug(
      `[updateRedFox.updateRedFoxOnDatabase] Updating RedFox ${redFoxId} on database...`,
    );

    const redFox = await RedFox.findOneAndUpdate({ _id: redFoxId }, update, {
      new: true,
    }).catch((e) => {
      throw new Error(e);
    });

    Logger.debug(
      `[updateRedFox.updateRedFoxOnDatabase] RedFox ${redFox._id} updated on database.`,
    );
    return redFox;
  } catch (exception) {
    throw new Error(
      `[updateRedFox.updateRedFoxOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[updateRedFox.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.id) throw new Error('options.id is required.');
    if (!options.update) throw new Error('options.update is required.');

    Logger.debug('[updateRedFox.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[updateRedFox.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const { id, update } = options;
    const redFoxToUpdateId = id;

    const { _id } = await updateRedFoxOnDatabase({
      redFoxId: redFoxToUpdateId,
      update,
    });

    const updatedRedFox = await findRedFox({
      filter: { _id },
    });
    return updatedRedFox;
  } catch (exception) {
    throw new Error(`[updateRedFox] ${exception.message}`);
  }
};
