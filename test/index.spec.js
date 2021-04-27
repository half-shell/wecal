const path = require('path');
const util = require('util');
const { readFile } = require('fs').promises;
const { findSlot } = require('../src/index.js');

const getFilePath = (filename) => {
    return path.join(process.cwd(), 'data/', filename);
};

const getInputOutputFiles = () => (
    [1, 2, 3, /*4, 5*/].map(i => [
        getFilePath(util.format('%s%s.txt', "input", i)),
        getFilePath(util.format('%s%s.txt', "output", i)),
    ])
);

describe('wecal', () => {
    it.each(getInputOutputFiles())
    ('match input %s time slots with output %s', async (inputPath, outputPath) => {
        const input = await readFile(inputPath, { encoding: 'UTF-8' });
        const output = await readFile(outputPath, { encoding: 'UTF-8' });

        expect(findSlot(input)).toMatch(output);
    });
});
