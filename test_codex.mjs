import { ShiftEngine as E } from './engine.js';

let pass = 0;
let fail = 0;
const failures = [];

function check(condition, message) {
  if (condition) pass += 1;
  else {
    fail += 1;
    failures.push(message);
  }
}

function eq(actual, expected, message) {
  check(Object.is(actual, expected), `${message}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
}

function validTime(value) {
  return Number.isInteger(value) && value >= 0 && value < E.DAY;
}

function eventTimesValid(plan) {
  return !!plan && plan.events.every((event) =>
    validTime(event.start) &&
    validTime(event.end) &&
    (!Object.prototype.hasOwnProperty.call(event, 'at') || validTime(event.at))
  );
}

function noThrow(fn) {
  try {
    return { threw: false, value: fn() };
  } catch (error) {
    return { threw: true, error };
  }
}

const event = (plan, key) => plan.events.find((item) => item.key === key);

eq(E.toMin(' 00:00 '), 0, 'toMin trims and accepts lower bound');
eq(E.toMin('23:59'), 1439, 'toMin accepts upper bound');
eq(E.toMin('003:00'), null, 'toMin rejects three-digit hour');
check(E.toMin('-1:00') === null && E.toMin('24:00') === null && E.toMin('12:60') === null, 'toMin rejects negative and out-of-range times');

eq(E.classifyShift(E.toMin('04:30'), E.toMin('05:30')), 'early', 'classify exact 05:00 midpoint');
eq(E.classifyShift(E.toMin('09:30'), E.toMin('10:30')), 'day', 'classify exact 10:00 midpoint');
eq(E.classifyShift(E.toMin('15:30'), E.toMin('16:30')), 'evening', 'classify exact 16:00 midpoint');
eq(E.classifyShift(E.toMin('21:30'), E.toMin('22:30')), 'night', 'classify exact 22:00 midpoint');

const day = E.plan({ shiftStart: '09:00', shiftEnd: '17:00' });
check(day.type === 'day' && day.sleep.start === E.toMin('00:30') && day.sleep.end === E.toMin('08:00'), 'day plan has expected type and sleep window');

const early = E.plan({ shiftStart: '05:00', shiftEnd: '13:00' });
check(early.sleep.start === E.toMin('20:30') && early.sleep.end === E.toMin('04:00') && E.durMin(early.sleep.start, early.sleep.end) === 450, 'early sleep crosses midnight for 7.5h');

const caffeine = event(day, 'caffeine');
check(caffeine.start === E.toMin('08:00') && caffeine.end === E.toMin('18:30') && day.caffeineCutoff === E.toMin('18:30'), 'day caffeine window ends 6h before sleep');

const lateNight = E.plan({ shiftStart: '22:00', shiftEnd: '06:00' });
const avoid = event(lateNight, 'lightAvoid');
const nap = event(lateNight, 'nap');
check(avoid.start === E.toMin('06:00') && avoid.end === E.toMin('07:15') && nap.start === E.toMin('19:30') && nap.end === E.toMin('19:55'), 'night lightAvoid and nap times are exact');

check([
  E.plan({ shiftStart: '22:00', shiftEnd: '06:00' }),
  E.plan({ shiftStart: '05:00', shiftEnd: '13:00' }),
  E.plan({ shiftStart: '09:00', shiftEnd: '17:00' }),
  E.plan({ shiftStart: '16:00', shiftEnd: '23:00' }),
].every(eventTimesValid), 'valid plans emit only integer event times in [0, 1440)');

check(
  E.plan({ shiftStart: -1, shiftEnd: '07:00' }) === null &&
  E.plan({ shiftStart: 1440, shiftEnd: '07:00' }) === null &&
  E.plan({ shiftStart: NaN, shiftEnd: '07:00' }) === null,
  'invalid numeric shift minutes are rejected'
);

const nullPlan = noThrow(() => E.plan(null));
const badOptions = noThrow(() => E.plan({ shiftStart: '19:00', shiftEnd: '07:00', sleepHours: 'bad' }));
check(
  !nullPlan.threw &&
  nullPlan.value === null &&
  !badOptions.threw &&
  (badOptions.value === null || eventTimesValid(badOptions.value)),
  'invalid plan object/options do not throw or emit invalid event times'
);

console.log(`\nCodex edge tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
if (fail) {
  console.log('\nFAILURES:');
  failures.forEach((failure) => console.log(`  - ${failure}`));
  process.exit(1);
}
console.log('ALL GREEN');
