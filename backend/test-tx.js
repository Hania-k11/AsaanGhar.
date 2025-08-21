// test-tx.js
const { utcToZonedTime } = require('date-fns-tz');

const date = new Date();
const timeZone = 'Asia/Karachi';
console.log(utcToZonedTime(date, timeZone));
