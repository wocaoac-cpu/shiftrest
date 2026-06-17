/*
 * ShiftRest engine — deterministic circadian plan for shift workers.
 * Dependency-free; runs identically in the browser and Node. No network.
 *
 * Given your shift, it computes WHEN to sleep, seek light, wear sunglasses,
 * cut caffeine, and nap — as timed events on a 24h timeline. Guidance follows
 * general Sleep Foundation / CDC advice for shift work. NOT medical advice.
 *
 * The engine returns stable event `key`s + minute-of-day times; the UI
 * localizes labels/explanations by key (so the result is fully trilingual).
 */

const DAY = 1440;
const mod = (n, m) => ((n % m) + m) % m;

function toMin(t) {
  const m = String(t == null ? '' : t).trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = +m[1], mi = +m[2];
  if (h > 23 || mi > 59) return null;
  return h * 60 + mi;
}
function toHHMM(min) {
  const x = mod(Math.round(min), DAY);
  return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');
}
// shift length in minutes (handles overnight); equal start/end treated as 24h
function durMin(start, end) { return mod(end - start, DAY) || DAY; }

// classify by the shift's midpoint hour
function classifyShift(start, end) {
  const mid = mod(start + durMin(start, end) / 2, DAY);
  const h = mid / 60;
  if (h >= 22 || h < 5) return 'night';
  if (h < 10) return 'early';
  if (h < 16) return 'day';
  return 'evening';
}

const DEFAULTS = { sleepHours: 7.5, windDown: 45, commute: 30, caffeineCutoffH: 6, prep: 60, nap: true };

// normalize a shift time: strings via toMin; numbers only if a finite integer minute-of-day
function normMin(v) {
  if (typeof v === 'number') return (Number.isFinite(v) && Number.isInteger(v) && v >= 0 && v < DAY) ? v : null;
  return toMin(v);
}
// validate a numeric option; fall back to default and clamp to a sane range
function numOpt(v, def, min, max) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, n));
}

function plan(input = {}) {
  if (input == null || typeof input !== 'object') return null;
  const start = normMin(input.shiftStart);
  const end = normMin(input.shiftEnd);
  if (start == null || end == null) return null;

  const sleepHours = numOpt(input.sleepHours, DEFAULTS.sleepHours, 1, 14);
  const windDown = numOpt(input.windDown, DEFAULTS.windDown, 0, 240);
  const commute = numOpt(input.commute, DEFAULTS.commute, 0, 240);
  const caffH = numOpt(input.caffeineCutoffH, DEFAULTS.caffeineCutoffH, 0, 12);
  const prep = numOpt(input.prep, DEFAULTS.prep, 0, 240);
  const nap = input.nap == null ? DEFAULTS.nap : !!input.nap;

  const sleepLen = Math.round(sleepHours * 60);
  const dur = durMin(start, end);
  const type = classifyShift(start, end);
  const postShift = (type === 'night' || type === 'evening');

  // main sleep window
  let sleepStart;
  if (type === 'night') sleepStart = mod(end + commute + windDown, DAY);
  else if (type === 'evening') sleepStart = mod(end + windDown, DAY);
  else { const wake = mod(start - prep, DAY); sleepStart = mod(wake - sleepLen, DAY); } // early/day: sleep before shift
  const sleepEnd = mod(sleepStart + sleepLen, DAY);

  const caffeineCutoff = mod(sleepStart - caffH * 60, DAY);
  const caffeineStart = postShift ? start : mod(start - prep, DAY);

  const events = [];
  // wind-down
  events.push({ key: 'winddown', start: mod(sleepStart - windDown, DAY), end: sleepStart });
  // main sleep
  events.push({ key: 'sleep', start: sleepStart, end: sleepEnd });
  // caffeine OK window (until cutoff)
  events.push({ key: 'caffeine', start: caffeineStart, end: caffeineCutoff, at: caffeineCutoff });
  // light seeking — first half of shift (esp. night/early to stay alert + anchor clock)
  if (type === 'night' || type === 'early') {
    events.push({ key: 'lightSeek', start: start, end: mod(start + Math.round(dur / 2), DAY) });
  }
  // light avoidance / sunglasses — after a night shift, on the commute home into morning light
  if (type === 'night') {
    events.push({ key: 'lightAvoid', start: end, end: sleepStart });
  }
  // optional pre-shift nap (night shift)
  if (nap && type === 'night') {
    events.push({ key: 'nap', start: mod(start - 150, DAY), end: mod(start - 150 + 25, DAY) });
  }

  return {
    type, postShift,
    shift: { start, end, dur },
    sleep: { start: sleepStart, end: sleepEnd, hours: sleepHours },
    caffeineCutoff,
    events,
    headline: { sleepStart, sleepEnd, sleepStartHHMM: toHHMM(sleepStart), sleepEndHHMM: toHHMM(sleepEnd) }
  };
}

const ShiftEngine = { toMin, toHHMM, durMin, classifyShift, plan, DAY, DEFAULTS };
export { ShiftEngine };
export default ShiftEngine;
if (typeof window !== 'undefined') window.ShiftEngine = ShiftEngine;
