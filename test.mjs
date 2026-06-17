// ShiftRest engine tests — deterministic circadian plan. Run: node test.mjs
import { ShiftEngine as E } from './engine.js';

let pass = 0, fail = 0; const fails = [];
function ok(c, m) { if (c) pass++; else { fail++; fails.push(m); } }
function eq(a, b, m) { ok(a === b, `${m} — got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); }
const ev = (p, k) => p.events.find(e => e.key === k);

// ---- time helpers ----
eq(E.toMin('19:00'), 1140, 'toMin 19:00');
eq(E.toMin('07:00'), 420, 'toMin 07:00');
eq(E.toMin('9:30'), 570, 'toMin 9:30');
eq(E.toMin('24:00'), null, 'toMin reject 24:00');
eq(E.toMin('12:60'), null, 'toMin reject 12:60');
eq(E.toMin('bad'), null, 'toMin reject non-time');
eq(E.toHHMM(495), '08:15', 'toHHMM 495');
eq(E.toHHMM(945), '15:45', 'toHHMM 945');
eq(E.toHHMM(1500), '01:00', 'toHHMM wraps past midnight');
eq(E.toHHMM(0), '00:00', 'toHHMM 0');
eq(E.durMin(1140, 420), 720, 'durMin overnight 12h');
eq(E.durMin(540, 1020), 480, 'durMin day 8h');
eq(E.durMin(600, 600), 1440, 'durMin equal -> 24h');

// ---- classify ----
eq(E.classifyShift(1140, 420), 'night', 'classify 19:00-07:00 night');
eq(E.classifyShift(540, 1020), 'day', 'classify 09:00-17:00 day');
eq(E.classifyShift(300, 780), 'early', 'classify 05:00-13:00 early');
eq(E.classifyShift(960, 1380), 'evening', 'classify 16:00-23:00 evening');
eq(E.classifyShift(1320, 480), 'night', 'classify 22:00-08:00 night');

// ---- plan: night shift 19:00-07:00 (primary case) ----
const n = E.plan({ shiftStart: '19:00', shiftEnd: '07:00' });
eq(n.type, 'night', 'night: type');
eq(n.postShift, true, 'night: postShift');
eq(n.sleep.start, 495, 'night: sleep start 08:15');
eq(n.sleep.end, 945, 'night: sleep end 15:45');
eq(n.headline.sleepStartHHMM, '08:15', 'night: headline start');
eq(n.headline.sleepEndHHMM, '15:45', 'night: headline end');
eq(n.caffeineCutoff, 135, 'night: caffeine cutoff 02:15');
ok(ev(n, 'sleep') && ev(n, 'winddown') && ev(n, 'caffeine'), 'night: core events present');
ok(ev(n, 'lightSeek'), 'night: light-seek present');
ok(ev(n, 'lightAvoid'), 'night: sunglasses/light-avoid present');
ok(ev(n, 'nap'), 'night: nap present by default');
eq(ev(n, 'winddown').start, 450, 'night: winddown 07:30');
eq(ev(n, 'lightAvoid').start, 420, 'night: light-avoid from shift end 07:00');
eq(ev(n, 'lightAvoid').end, 495, 'night: light-avoid until sleep 08:15');
eq(ev(n, 'caffeine').end, 135, 'night: caffeine window ends at cutoff');

// nap toggle + custom sleep length
ok(!ev(E.plan({ shiftStart: '19:00', shiftEnd: '07:00', nap: false }), 'nap'), 'nap off -> no nap event');
const n6 = E.plan({ shiftStart: '19:00', shiftEnd: '07:00', sleepHours: 6 });
eq(n6.sleep.end, E.toMin('14:15'), 'custom 6h sleep -> ends 14:15');

// ---- plan: early shift 05:00-13:00 (sleep BEFORE shift) ----
const e = E.plan({ shiftStart: '05:00', shiftEnd: '13:00' });
eq(e.type, 'early', 'early: type');
eq(e.postShift, false, 'early: not post-shift');
eq(e.sleep.start, 1230, 'early: sleep start 20:30');
eq(e.sleep.end, 240, 'early: sleep end 04:00');
ok(ev(e, 'lightSeek'), 'early: light-seek present');
ok(!ev(e, 'lightAvoid'), 'early: no sunglasses event (not night)');
ok(!ev(e, 'nap'), 'early: no nap (not night)');

// ---- plan: evening shift 16:00-23:00 ----
const v = E.plan({ shiftStart: '16:00', shiftEnd: '23:00' });
eq(v.type, 'evening', 'evening: type');
eq(v.sleep.start, E.toMin('23:45'), 'evening: sleep soon after shift+winddown');
ok(!ev(v, 'lightAvoid'), 'evening: no sunglasses event');

// ---- invalid input ----
eq(E.plan({ shiftStart: 'bad', shiftEnd: '07:00' }), null, 'invalid start -> null');
eq(E.plan({}), null, 'empty -> null');
eq(E.plan({ shiftStart: '19:00' }), null, 'missing end -> null');

// numeric input also accepted
const num = E.plan({ shiftStart: 1140, shiftEnd: 420 });
eq(num.sleep.start, 495, 'numeric minutes input works');

// every event has valid times within a day
ok(n.events.every(x => x.start >= 0 && x.start < 1440 && x.end >= 0 && x.end < 1440), 'all event times in 0-1439');

// ---- robustness (hardening from Codex audit) ----
eq(E.plan(null), null, 'plan(null) -> null (no throw)');
eq(E.plan('x'), null, 'plan(string) -> null');
eq(E.plan({ shiftStart: -1, shiftEnd: 420 }), null, 'negative minute rejected');
eq(E.plan({ shiftStart: 1440, shiftEnd: 420 }), null, 'minute 1440 rejected');
eq(E.plan({ shiftStart: NaN, shiftEnd: 420 }), null, 'NaN minute rejected');
eq(E.plan({ shiftStart: Infinity, shiftEnd: 420 }), null, 'Infinity minute rejected');
eq(E.plan({ shiftStart: 90.5, shiftEnd: 420 }), null, 'non-integer minute rejected');
// bad options fall back to safe defaults, never NaN
const badOpt = E.plan({ shiftStart: '19:00', shiftEnd: '07:00', sleepHours: 'bad' });
ok(badOpt && Number.isFinite(badOpt.sleep.start) && Number.isFinite(badOpt.sleep.end), 'bad sleepHours -> finite times');
ok(badOpt.events.every(x => Number.isFinite(x.start) && Number.isFinite(x.end) && x.start >= 0 && x.start < 1440), 'bad options -> all event times valid');
// out-of-range option clamped
const clamp = E.plan({ shiftStart: '19:00', shiftEnd: '07:00', sleepHours: 999 });
ok(clamp.sleep.hours <= 14, 'absurd sleepHours clamped');

// ---- report ----
console.log(`\nShiftRest engine tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
if (fail) { console.log('\nFAILURES:'); fails.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
else console.log('ALL GREEN ✓');
