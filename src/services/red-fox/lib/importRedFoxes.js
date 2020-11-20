/* eslint-disable dot-notation */
import csv from 'csvtojson';
import Logger from '../../../loaders/logger';
import createRedFox from './createRedFox';

const createRedFoxOnDatabase = async ({ redFoxData, currentUserId }) => {
  try {
    Logger.debug('[importRedFoxes.createRedFox] Creating RedFox...');
    const redFox = {
      createdSource: 'csv-import',
      currentUserId,
      ...redFoxData,
    };

    const newRedFox = await createRedFox(redFox).catch((e) => {
      throw new Error(e);
    });

    Logger.debug(
      `[importRedFoxes.createRedFox] RedFox ${newRedFox._id} created.`,
    );

    return newRedFox._id;
  } catch (exception) {
    throw new Error(`[importRedFoxes.createRedFox] ${exception.message}`);
  }
};

const formatRedFoxData = ({ row }) => {
  try {
    Logger.debug('[importRedFoxes.formatRedFoxData] Formatting RedFox data...');

    return {
      name: row['Name'] || null,
      status: row['Status'] || null,
    };
  } catch (exception) {
    throw new Error(`[importRedFoxes.formatRedFoxData] ${exception.message}`);
  }
};

const processRow = async ({ row, currentUserId }) => {
  try {
    const res = {
      rowImportErrors: [],
    };

    const redFoxData = formatRedFoxData({
      row,
    });

    if (redFoxData.title) {
      await createRedFoxOnDatabase({
        redFoxData,
        currentUserId,
      })
        .then((newRedFoxId) => {
          res.createdRedFox = true;
          res.redFoxId = newRedFoxId;
        })
        .catch((error) => {
          res.rowImportErrors.push({
            message: `Could not create RedFox with name: ${row['Name']}`,
            error,
          });
        });
    }

    return res;
  } catch (exception) {
    throw new Error(`[importRedFoxes.processRow] ${exception.message}`);
  }
};

const processCsv = async ({ file, currentUserId }) => {
  try {
    Logger.debug('[importRedFoxes.processCsv] Processing CSV...');

    let createdRedFoxes = 0;
    let importErrors = [];

    await csv()
      .fromFile(file.path)
      // Process each line asynchonously
      .subscribe(async (row) => {
        const res = await processRow({
          row,
          currentUserId,
        });

        if (res.createdRedFox) createdRedFoxes += 1;

        if (res.rowImportErrors)
          importErrors = importErrors.concat(res.rowImportErrors);
      });

    return { createdRedFoxes, importErrors };
  } catch (exception) {
    throw new Error(`[importRedFoxes.processCsv] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    Logger.debug('[importRedFoxes.validateOptions] Validating options...');

    if (!options) throw new Error('options object is required.');
    if (!options.file) throw new Error('options.file is required.');

    Logger.debug('[importRedFoxes.validateOptions] Validating options passed.');
  } catch (exception) {
    throw new Error(`[importRedFoxes.validateOptions] ${exception.message}`);
  }
};

export default async (options) => {
  try {
    validateOptions(options);
    const { file, currentUser } = options;
    const { createdRedFoxes, importErrors } = await processCsv({
      file,
      currentUserId: currentUser._id,
    });

    return { createdRedFoxes, importErrors };
  } catch (exception) {
    throw new Error(`[importRedFoxes] ${exception.message}`);
  }
};
