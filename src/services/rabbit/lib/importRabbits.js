/* eslint-disable dot-notation */
import csv from 'csvtojson';
import Logger from '../../../loaders/logger';
import createRabbit from './createRabbit';

const createRabbitOnDatabase = async ({ rabbitData, currentUserId }) => {
  try {
    Logger.debug('[importRabbits.createRabbit] Creating rabbit...');
    const rabbit = {
      createdSource: 'csv-import',
      currentUserId,
      ...rabbitData,
    };

    const newRabbit = await createRabbit(rabbit).catch(e => {
      throw new Error(e);
    });

    Logger.debug(
      `[importRabbits.createRabbit] Rabbit ${newRabbit._id} created.`,
    );

    return newRabbit._id;
  } catch (exception) {
    throw new Error(`[importRabbits.createRabbit] ${exception.message}`);
  }
};

const formatRabbitData = ({ row }) => {
  try {
    Logger.debug('[importRabbits.formatRabbitData] Formatting rabbit data...');

    return {
      title: row['Title'] || null,
      status: row['Status'] || null,
    };
  } catch (exception) {
    throw new Error(`[importRabbits.formatRabbitData] ${exception.message}`);
  }
};

const processRow = async ({ row, currentUserId }) => {
  try {
    const res = {
      rowImportErrors: [],
    };

    const rabbitData = formatRabbitData({
      row,
    });

    if (rabbitData.title) {
      await createRabbitOnDatabase({
        rabbitData,
        currentUserId,
      })
        .then(newRabbitId => {
          res.createdRabbit = true;
          res.rabbitId = newRabbitId;
        })
        .catch(error => {
          // TODO: Add row count?
          res.rowImportErrors.push({
            message: `Could not create Rabbit with title: ${row['Title']}`,
            error,
          });
        });
    }

    return res;
  } catch (exception) {
    throw new Error(`[importRabbits.processRow] ${exception.message}`);
  }
};

const processCsv = async ({ file, currentUserId }) => {
  try {
    Logger.debug('[importRabbits.processCsv] Processing CSV...');

    let createdRabbits = 0;
    let importErrors = [];

    await csv()
      .fromFile(file.path)
      // Process each line asynchonously
      .subscribe(async row => {
        const res = await processRow({
          row,
          currentUserId,
        });

        if (res.createdRabbit) createdRabbits += 1;

        if (res.rowImportErrors)
          importErrors = importErrors.concat(res.rowImportErrors);
      });

    return { createdRabbits, importErrors };
  } catch (exception) {
    throw new Error(`[importRabbits.processCsv] ${exception.message}`);
  }
};

const validateOptions = options => {
  try {
    Logger.debug('[importRabbits.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.file) throw new Error('options.file is required.');

    Logger.debug('[importRabbits.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[importRabbits.validateOptions] ${exception.message}`);
  }
};

export default async options => {
  try {
    validateOptions(options);
    const { file, currentUser } = options;
    const { createdRabbits, importErrors } = await processCsv({
      file,
      currentUserId: currentUser._id,
    });

    return { createdRabbits, importErrors };
  } catch (exception) {
    throw new Error(`[importRabbits] ${exception.message}`);
  }
};
