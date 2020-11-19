#! /usr/bin/env node
const path = require('path');

const packageDirectory = path.dirname(__dirname);
const projectDirectory = path.dirname(process.cwd());

console.log(`packageDirectory: ${packageDirectory}`);
console.log(`projectDirectory: ${projectDirectory}`);
