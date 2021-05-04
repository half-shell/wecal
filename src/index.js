const {
    formatDate,
    formatOutput,
    parseInput,
    parseRange
} = require('./utils');

const {
    FIRST_SLOT,
    LAST_SLOT,
    ONE_HOUR,
} = require('./constants');

const getEarlierBegginingRangeIndex = (needle, stack) => {
    const begs = stack.map(([beg]) => beg);
    let index = -1;

    for(let i=0; i <= begs.length - 1; i++) {
        if (needle <= begs[i]) {
            index =  i;
            break;
        }
    }

    return index;
}

const getLaterEndingRangeIndex = (needle, stack) => {
    const ends = stack.map(([,end]) => end);
    let index = -1;

    for(let i=0; i <= ends.length - 1; i++) {
        if (needle >= ends[i]) {
            index = i;
            break;
        }
    }

    return index;
}

const isTimerangeIncluded = ([beg, end], timeRanges) => {
    return timeRanges.reduce((acc, tr) => {
        return acc && beg < tr[1] && end > tr[0]
    }, true)
}

const mergeTimeRanges = (timeRange) => {
    return timeRange.reduce((acc, [beg, end], idx) => {
        const earlierIdx = getEarlierBegginingRangeIndex(beg, acc);
        const laterIdx = getLaterEndingRangeIndex(end, acc);
        const isIncluded = isTimerangeIncluded([beg, end], acc);

        if ((earlierIdx == -1 && laterIdx == -1) && !isIncluded) {
            acc = [...acc, [beg, end]];
        }

        if (earlierIdx !== -1 && isIncluded) {
            acc[earlierIdx][0] = beg;
        }

        if (laterIdx !== -1 && isIncluded) {
            acc[laterIdx][1] = end;
        }

        return acc
    }, [timeRange[0]]);
}

const findGap = (day, timeRanges) => {
    const filteredRanges = timeRanges
          .map(parseRange)
          .sort(([t1], [t2]) => t1 - t2);

    const mergedRanges = mergeTimeRanges(filteredRanges);

    const allSlots = [
        [FIRST_SLOT, FIRST_SLOT],
        ...mergedRanges,
        [LAST_SLOT, LAST_SLOT]
    ];

    return allSlots
    // NOTE(half-shell): Is there room for an hour in between the beginning of this slot
    // and the beginning of the next one
        .filter(([beg, end], idx, slots) => {
            if (!slots[idx+1]) return true;

            return slots[idx+1][0] - beg >= ONE_HOUR;
        })
    // NOTE(half-shell): Is there room for an hour in between the end of this slot and the end of the next one
        .filter(([beg, end], idx, slots) => {
            if (!slots[idx+1]) return false;

            return slots[idx+1][1] - end >= ONE_HOUR;
        })
        .map(([, slot]) => slot);
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
