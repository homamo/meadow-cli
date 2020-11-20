/* eslint-disable class-methods-use-this */
import createRedFox from './lib/createRedFox';
import updateRedFox from './lib/updateRedFox';
import deleteRedFox from './lib/deleteRedFox';
import deleteRedFoxes from './lib/deleteRedFoxes';
import countRedFoxes from './lib/countRedFoxes';
import findRedFox from './lib/findRedFox';
import findRedFoxes from './lib/findRedFoxes';
import duplicateRedFox from './lib/duplicateRedFox';
import exportRedFoxes from './lib/exportRedFoxes';
import importRedFoxes from './lib/importRedFoxes';
import generateRedFoxPdf from './lib/generateRedFoxPdf';
import getRandomRedFox from './lib/getRandomRedFox';
// DEV
import createFakeRedFoxes from './lib/createFakeRedFoxes';

export default class RedFoxService {
  async Create(options) {
    return createRedFox(options);
  }

  async Update(options) {
    return updateRedFox(options);
  }

  async Delete(options) {
    return deleteRedFox(options);
  }

  async MultiDelete(options) {
    return deleteRedFoxes(options);
  }

  async All(options) {
    return findRedFoxes(options);
  }

  async Single(options) {
    return findRedFox(options);
  }

  async Count(options) {
    return countRedFoxes(options);
  }

  async Random(options) {
    return getRandomRedFox(options);
  }

  async Duplicate(options) {
    return duplicateRedFox(options);
  }

  async Export(options) {
    return exportRedFoxes(options);
  }

  async Import(options) {
    return importRedFoxes(options);
  }

  async GeneratePdf(options) {
    return generateRedFoxPdf(options);
  }

  async CreateFake(options) {
    return process.env.NODE_ENV === 'development'
      ? createFakeRedFoxes(options)
      : undefined;
  }
}
