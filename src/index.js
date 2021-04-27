const util = require('util');

const ONE_HOUR = 60*60*1000;
const ONE_MINUTE = 60*1000;

const FIRST_SLOT = new Date();
FIRST_SLOT.setUTCHours("08", "00", "0", "0");
const LAST_SLOT = new Date();
LAST_SLOT.setUTCHours("17", "59", "0", "0");

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
    begTime.setUTCHours(begHours, begMins, "0", "0");
    const endTime = new Date();
    endTime.setUTCHours(endHours, endMins, "0", "0");

    return [begTime, endTime];
}

const filterRanges = (timeRanges) => {
    return timeRanges
        .map(parseRange)
        .filter((tr, idx, trs) => {
            // NOTE(half-shell): We return the first time range no matter what so we have
            // at least 1 timerange since we're default to false
            if (idx == 0) return true;
            if (idx < trs.length - 1) return !(tr[1] < trs[idx + 1][0])

            return false;
        });
};

const findGap = (day, timeRanges) => {
    const filteredRanges = filterRanges(timeRanges);

    const allSlots = [
        [FIRST_SLOT, FIRST_SLOT],
        ...filteredRanges,
        [LAST_SLOT, LAST_SLOT]
    ];

    return allSlots
        .filter((slot, idx) => {
            if (allSlots && allSlots[idx+1]) {
                // NOTE(half-shell): This gets us the 59min interval needed
                return (allSlots[idx + 1][0].getTime() - slot[1].getTime()) >= ONE_HOUR;
            }

            return false;
        })
        .map(slots => slots[1]);
};

const findSlot = (slots) => {
    const parsedSlots = parseInput(slots);

    const [firstTimeGap] = Object.keys(parsedSlots)
          .sort()
          .map(day => ({
              day,
              gap: findGap(day, parsedSlots[day])
          }))
          .filter(timeGap => timeGap.gap.length);

    if (!firstTimeGap) throw new Error('No time slot has been found for this week');

    return formatOutput(firstTimeGap.day, firstTimeGap.gap[0]);
};

module.exports = {
    findSlot,
};
