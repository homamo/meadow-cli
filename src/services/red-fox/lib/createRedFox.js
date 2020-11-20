import RedFox from '../../../models/RedFox';
import Logger from '../../../loaders/logger';
import findRedFox from './findRedFox';
import UserService from '../../user';

const addRedFoxToOwner = async ({ redFoxId, ownerId, userService }) => {
  try {
    Logger.debug(
      `[createRedFox.addRedFoxToOwner] Adding RedFox ${redFoxId} to owner ${ownerId}`,
    );

    const user = await userService
      .Update({
        id: ownerId,
        update: { $push: { redFox_ids: redFoxId } },
      })
      .catch((e) => {
        throw new Error(e);
      });

    return user;
  } catch (exception) {
    throw new Error(`[createRedFox.addRedFoxToOwner] ${exception.message}`);
  }
};

const createRedFoxOnDatabase = async ({
  name,
  status,
  currentUserId,
  ownerId,
  createdSource,
}) => {
  try {
    Logger.debug(
      '[createRedFox.createRedFoxOnDatabase] Creating RedFox on database...',
    );

    const redFox = await RedFox.create({
      name,
      status,
      owner_id: ownerId || currentUserId,
      createdSource,
    }).catch((e) => {
      throw new Error(e);
    });

    Logger.debug(
      `[createRedFox.createRedFoxOnDatabase] RedFox ${redFox._id} created on database.`,
    );
    return redFox;
  } catch (exception) {
    throw new Error(
      `[createRedFox.createRedFoxOnDatabase] ${exception.message}`,
    );
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[createRedFox.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.title) throw new Error('options.title is required.');
    if (!options.currentUserId && !options.ownerId)
      throw new Error('options.currentUserId or options.ownerId is required.');

    Logger.debug('[createRedFox.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[createRedFox.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const userService = new UserService();
    const { _id } = await createRedFoxOnDatabase(options);
    const redFox = await findRedFox({ filter: { _id } });
    await addRedFoxToOwner({
      redFoxId: redFox._id,
      ownerId: redFox.owner_id,
      userService,
    });
    return redFox;
  } catch (exception) {
    throw new Error(`[createRedFox] ${exception.message}`);
  }
};
