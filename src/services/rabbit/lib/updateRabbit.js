import Rabbit from '../../../models/Rabbit';
import Logger from '../../../loaders/logger';
import findRabbit from './findRabbit';

const updateRabbitOnDatabase = async ({ rabbitId, update }) => {
  try {
    Logger.debug(
      `[updateRabbit.updateRabbitOnDatabase] Updating rabbit ${rabbitId} on database...`,
    );

    const rabbit = await Rabbit.findOneAndUpdate({ _id: rabbitId }, update, {
      new: true,
    }).catch(e => {
      throw new Error(e);
    });

    Logger.debug(
      `[updateRabbit.updateRabbitOnDatabase] Rabbit ${rabbit._id} updated on database.`,
    );
    return rabbit;
  } catch (exception) {
    throw new Error(
      `[updateRabbit.updateRabbitOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = options => {
  try {
    Logger.debug('[updateRabbit.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.id) throw new Error('options.id is required.');
    if (!options.update) throw new Error('options.update is required.');

    Logger.debug('[updateRabbit.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[updateRabbit.validateOptions] ${exception.message}`);
  }
};

export default async options => {
  try {
    validateOptions(options);
    const { id, update } = options;
    const rabbitToUpdateId = id;

    const { _id } = await updateRabbitOnDatabase({
      rabbitId: rabbitToUpdateId,
      update,
    });

    const updatedRabbit = await findRabbit({
      filter: { _id },
    });
    return updatedRabbit;
  } catch (exception) {
    throw new Error(`[updateRabbit] ${exception.message}`);
  }
};
