#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import srtTranslate from './srtTranslate.js';

const yarg = yargs(
    hideBin(process.argv)
);

/**
 * CLI Options
 */
yarg.option('k', {
    alias: 'key',
    demandOption: true,
    describe: 'Your Google Cloud API .json file',
    type: 'string'
}).option('i', {
    alias: 'input',
    demandOption: true,
    describe: 'Source file (.srt)',
    type: 'string'
}).option('o', {
    alias: 'output',
    demandOption: true,
    describe: 'Output file (.srt)',
    type: 'string'
}).option('t', {
    alias: 'target',
    demandOption: true,
    describe: 'Target language (en, ru and so on)',
    type: 'string'
}).option('d', {
    alias: 'delay',
    default: 200,
    describe: 'Delay between requests',
    type: 'integer'
}).option('s', {
    alias: 'silent',
    describe: 'Disables the printing of translated lines',
    type: 'boolean'
});

/**
 * Get arguments
 */
const argv = yarg.argv;

/**
 * Initialize translator class
 */
(async () =>
{
    let instance = new srtTranslate(argv);

    instance.init();
})();

/**
 * Parse options
 */
yarg.parse();