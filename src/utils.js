const util = require('util');
const { FIRST_SLOT } = require('./constants');

const formatDate = (date) => {
    return util.format("%s:%s",
                       // padding output timestamp wiht "0"s
                       ("0" + date.getUTCHours()).slice(-2),
                       ("0" + date.getUTCMinutes()).slice(-2));
};

const formatOutput = (day, begTime) => {
    const endTime = new Date();

    // NOTE(half-shell): We want the meeting to take place 1 min after the last one
    // Expect if it is the first slot
    if (begTime.getTime() !== FIRST_SLOT.getTime()) {
        begTime.setTime(begTime.getTime() + 60*1000);
    }

    endTime.setTime(begTime.getTime() + 60*59*1000);

    return util.format('%s %s-%s', day, formatDate(begTime), formatDate(endTime));
};

const parseInput = (input) => {
    return input
        .split('\n')
        .map(e => e.split(' '))
        .reduce((acc, [day, slot]) => {
            if (!acc[day]) {
                acc[day] = [slot];
            } else {
                acc[day] = [...acc[day], slot];
            }

            return acc;
        }, {});
};

const parseRange = (timeRange) => {
    const [beg, end] = timeRange.split('-');

    const [begHours, begMins] = beg.split(':');
    const [endHours, endMins] = end.split(':');

    const begTime = new Date();
    const endTime = new Date();

    begTime.setUTCHours(begHours, begMins, "0", "0");
    endTime.setUTCHours(endHours, endMins, "0", "0");

    return [begTime, endTime];
}

module.exports = {
    formatDate,
    formatOutput,
    parseInput,
    parseRange,
}
