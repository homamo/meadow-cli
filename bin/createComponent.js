#! /usr/bin/env node
const { capitalize } = require('@homamo/meadow-utils');
const createComponent = require('../lib/createComponent');

const name = capitalize(process.argv[2]);

console.log(`Running Create Component with '${name}'`);

createComponent({ name });
