/* eslint-disable class-methods-use-this */
import createRabbit from './lib/createRabbit';
import updateRabbit from './lib/updateRabbit';
import deleteRabbit from './lib/deleteRabbit';
import deleteRabbits from './lib/deleteRabbits';
import countRabbits from './lib/countRabbits';
import findRabbit from './lib/findRabbit';
import findRabbits from './lib/findRabbits';
import duplicateRabbit from './lib/duplicateRabbit';
import exportRabbits from './lib/exportRabbits';
import importRabbits from './lib/importRabbits';
import generateRabbitPdf from './lib/generateRabbitPdf';
import getRandomRabbit from './lib/getRandomRabbit';
// DEV
import createFakeRabbits from './dev/createFakeRabbits';

export default class RabbitService {
  async Create(options) {
    return createRabbit(options);
  }

  async Update(options) {
    return updateRabbit(options);
  }

  async Delete(options) {
    return deleteRabbit(options);
  }

  async MultiDelete(options) {
    return deleteRabbits(options);
  }

  async All(options) {
    return findRabbits(options);
  }

  async Single(options) {
    return findRabbit(options);
  }

  async Count(options) {
    return countRabbits(options);
  }

  async Random(options) {
    return getRandomRabbit(options);
  }

  async Duplicate(options) {
    return duplicateRabbit(options);
  }

  async Export(options) {
    return exportRabbits(options);
  }

  async Import(options) {
    return importRabbits(options);
  }

  async GeneratePdf(options) {
    return generateRabbitPdf(options);
  }

  async CreateFake(options) {
    return process.env.NODE_ENV === 'development'
      ? createFakeRabbits(options)
      : undefined;
  }
}
