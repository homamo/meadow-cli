import Rabbit from '../../../models/Rabbit';
import Logger from '../../../loaders/logger';

const deleteRabbitOnDatabase = async rabbitId => {
  try {
    Logger.debug(
      `[deleteRabbit.deleteRabbitOnDatabase] Deleting rabbit ${rabbitId} on database...`,
    );

    const rabbit = await Rabbit.findByIdAndDelete(rabbitId).catch(e => {
      throw new Error(e);
    });

    Logger.debug(
      `[deleteRabbit.deleteRabbitOnDatabase] Rabbit ${rabbit._id} deleted on database.`,
    );
    return rabbit;
  } catch (exception) {
    throw new Error(
      `[deleteRabbit.deleteRabbitOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = options => {
  try {
    Logger.debug('[deleteRabbit.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.id) throw new Error('options.id is required.');

    Logger.debug('[deleteRabbit.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[deleteRabbit.validateOptions] ${exception.message}`);
  }
};

export default async options => {
  try {
    validateOptions(options);
    const rabbitIdToDelete = options.id;
    const deletedRabbit = await deleteRabbitOnDatabase(rabbitIdToDelete);
    return deletedRabbit.toObject();
  } catch (exception) {
    throw new Error(`[deleteRabbit] ${exception.message}`);
  }
};
