const ONE_HOUR = 60*60*1000;
const ONE_MINUTE = 60*1000;

const FIRST_SLOT = new Date();
FIRST_SLOT.setUTCHours("08", "00", "0", "0");
const LAST_SLOT = new Date();
LAST_SLOT.setUTCHours("17", "59", "0", "0");

module.exports = {
    FIRST_SLOT,
    LAST_SLOT,
    ONE_HOUR,
    ONE_MINUTE,
}
