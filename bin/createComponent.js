#! /usr/bin/env node
/* eslint-disable no-console */
const createComponent = require('../lib/createComponent');

const name = process.argv[2];
const pluralName = process.argv[3];

if (pluralName) {
  console.log(`Running Create Component with '${name}' and ${pluralName}`);
} else {
  console.log(`Running Create Component with '${name}'`);
}

createComponent({ name });
