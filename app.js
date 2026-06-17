import { ShiftEngine as E } from './engine.js';

/* ===================== i18n ===================== */
const I18N = {
  en: {
    lock: '100% local · nothing uploaded',
    kicker: 'SHIFT-WORK SLEEP PLANNER · 100% IN YOUR BROWSER',
    h1: ['Your shift tells you when to clock in. Now let it tell you ', 'when to sleep', '.'],
    lede: 'Paste your shift times and get a personalized 24-hour timeline — <b>when to sleep, seek light, wear sunglasses home, cut caffeine, and nap</b> — built on Sleep Foundation & CDC guidance. Runs entirely in your browser.',
    c_start: 'Shift starts', c_end: 'Shift ends', c_sleep: 'Sleep hours', c_nap: 'Pre-shift nap',
    f1: 'Project 0036 · built by Claude on the Opportunity Radar',
    disc: 'General guidance based on Sleep Foundation / CDC shift-work advice — educational, not medical advice. Talk to a clinician about persistent sleep problems. Everything runs in your browser.',
    sleep_tag: 'YOUR MAIN SLEEP WINDOW', sleep_sub: '{h}h — dark, cool, quiet. Keep this window consistent, even on days off.',
    tl_title: 'Your 24-hour plan', copy: 'Copy plan', copied: 'Copied ✓',
    type_night: 'Night shift', type_early: 'Early shift', type_day: 'Day shift', type_evening: 'Evening shift',
    ev_sleep: 'Sleep', ev_winddown: 'Wind down', ev_caffeine: 'Caffeine OK', ev_lightSeek: 'Seek light', ev_lightAvoid: 'Sunglasses / dark', ev_nap: 'Pre-shift nap',
    why_sleep: 'Your main sleep. Dark, cool, quiet room — and keep this window consistent, even on days off.',
    why_winddown: 'Wind down: dim the lights, screens off, let your body drift toward sleep.',
    why_caffeine: 'Coffee helps early in your shift, but stop by {cut} so it doesn’t wreck your sleep.',
    why_lightSeek: 'Get bright light early in your shift to stay alert and anchor your body clock.',
    why_lightAvoid: 'On the way home wear sunglasses and keep it dim — morning light tells your brain to wake up.',
    why_nap: 'A short nap before your shift takes the edge off the long night ahead.',
    p_night1: 'Night 19–07', p_night2: 'Night 23–07', p_evening: 'Evening 15–23', p_early: 'Early 05–13'
  },
  zh: {
    lock: '100% 本地 · 零上传',
    kicker: '倒班睡眠规划器 · 100% 浏览器本地运行',
    h1: ['你的班次告诉你几点上班。现在让它告诉你', '几点该睡', '。'],
    lede: '粘贴班次时间，立刻得到一张个性化 24 小时时间轴——<b>几点睡、几点晒光、几点戴墨镜回家、几点断咖啡、要不要班前小睡</b>——依据 Sleep Foundation / CDC 倒班睡眠建议。全程在你浏览器本地跑。',
    c_start: '上班时间', c_end: '下班时间', c_sleep: '睡眠时长', c_nap: '班前小睡',
    f1: '项目 0036 · 机会雷达上由 Claude 建造',
    disc: '依据 Sleep Foundation / CDC 倒班睡眠的通用建议——仅供学习参考，非医疗建议。长期睡眠问题请咨询医生。全程在你浏览器本地运行。',
    sleep_tag: '你的主睡眠窗口', sleep_sub: '{h} 小时——黑暗、凉爽、安静。尽量固定这个窗口，连休息日也一样。',
    tl_title: '你的 24 小时作息', copy: '复制作息', copied: '已复制 ✓',
    type_night: '夜班', type_early: '早班', type_day: '白班', type_evening: '晚班',
    ev_sleep: '睡眠', ev_winddown: '睡前放松', ev_caffeine: '可喝咖啡', ev_lightSeek: '晒光提神', ev_lightAvoid: '墨镜避光', ev_nap: '班前小睡',
    why_sleep: '你的主睡眠。房间要黑、凉、静——并尽量固定这个窗口，连休息日也别乱。',
    why_winddown: '睡前放松：调暗灯光、关掉屏幕，让身体慢慢进入睡眠状态。',
    why_caffeine: '上班前半段喝咖啡能提神，但 {cut} 之后别再喝，免得毁了你回家后的觉。',
    why_lightSeek: '上班前半段多见亮光，保持清醒、把生物钟往后锚定。',
    why_lightAvoid: '回家路上戴墨镜、保持昏暗——早晨的光会告诉大脑该醒了。',
    why_nap: '上班前小睡一会儿，能缓解漫长夜班的疲惫。',
    p_night1: '夜班 19–07', p_night2: '夜班 23–07', p_evening: '晚班 15–23', p_early: '早班 05–13'
  },
  uk: {
    lock: '100% локально · нічого не завантажується',
    kicker: 'ПЛАНУВАЛЬНИК СНУ ДЛЯ ЗМІННОЇ РОБОТИ · 100% У БРАУЗЕРІ',
    h1: ['Твоя зміна каже, коли на роботу. Тепер хай скаже, ', 'коли спати', '.'],
    lede: 'Встав час зміни — отримай персональну 24-годинну шкалу: <b>коли спати, ловити світло, вдягати окуляри дорогою додому, припиняти каву й чи дрімати перед зміною</b> — за рекомендаціями Sleep Foundation і CDC. Усе працює у твоєму браузері.',
    c_start: 'Початок зміни', c_end: 'Кінець зміни', c_sleep: 'Годин сну', c_nap: 'Дрімота перед зміною',
    f1: 'Проєкт 0036 · створено Claude на Radar можливостей',
    disc: 'Загальні поради за рекомендаціями Sleep Foundation / CDC — освітні, не медична порада. За постійних проблем зі сном зверніться до лікаря. Усе працює у браузері.',
    sleep_tag: 'ТВОЄ ГОЛОВНЕ ВІКНО СНУ', sleep_sub: '{h} год — темно, прохолодно, тихо. Тримай це вікно сталим, навіть у вихідні.',
    tl_title: 'Твій 24-годинний план', copy: 'Копіювати план', copied: 'Скопійовано ✓',
    type_night: 'Нічна зміна', type_early: 'Рання зміна', type_day: 'Денна зміна', type_evening: 'Вечірня зміна',
    ev_sleep: 'Сон', ev_winddown: 'Розслаблення', ev_caffeine: 'Кава дозволена', ev_lightSeek: 'Ловити світло', ev_lightAvoid: 'Окуляри / темрява', ev_nap: 'Дрімота перед зміною',
    why_sleep: 'Твій головний сон. Темна, прохолодна, тиха кімната — і тримай це вікно сталим, навіть у вихідні.',
    why_winddown: 'Розслаблення: приглуши світло, вимкни екрани, дай тілу налаштуватися на сон.',
    why_caffeine: 'Кава допомагає на початку зміни, але припини до {cut}, щоб не зіпсувати сон удома.',
    why_lightSeek: 'Лови яскраве світло на початку зміни — щоб бути бадьорим і зсунути біоритм.',
    why_lightAvoid: 'Дорогою додому вдягни окуляри й тримай напівтемряву — ранкове світло будить мозок.',
    why_nap: 'Коротка дрімота перед зміною полегшує довгу нічну зміну.',
    p_night1: 'Нічна 19–07', p_night2: 'Нічна 23–07', p_evening: 'Вечірня 15–23', p_early: 'Рання 05–13'
  }
};

const EV_META = {
  nap:       { color: 'var(--nap)', icon: '😴', border: 'var(--nap)' },
  lightSeek: { color: 'var(--light)', icon: '☀️', border: 'var(--light)' },
  caffeine:  { color: 'var(--caffeine)', icon: '☕', border: 'var(--caffeine)' },
  lightAvoid:{ color: 'var(--avoid)', icon: '🕶️', border: 'var(--avoid)' },
  winddown:  { color: 'var(--winddown)', icon: '🌙', border: 'var(--winddown)' },
  sleep:     { color: 'var(--sleep)', icon: '💤', border: 'var(--sleep)' }
};
const EV_ORDER = ['nap', 'lightSeek', 'caffeine', 'lightAvoid', 'winddown', 'sleep'];

const PRESETS = {
  p_night1: ['19:00', '07:00'], p_night2: ['23:00', '07:00'],
  p_evening: ['15:00', '23:00'], p_early: ['05:00', '13:00']
};

let lang = 'en', last = null;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (k) => (I18N[lang] && I18N[lang][k] != null) ? I18N[lang][k] : I18N.en[k];
const HHMM = (m) => E.toHHMM(m);
const pct = (m) => (m / E.DAY * 100);

/* ===================== render ===================== */
function recompute() {
  const p = E.plan({
    shiftStart: $('#shiftStart').value,
    shiftEnd: $('#shiftEnd').value,
    sleepHours: parseFloat($('#sleepHours').value),
    nap: $('#nap').checked
  });
  if (!p) return;
  last = p;
  render(p);
}

function bandHTML(start, end, color) {
  // returns one or two absolutely-positioned bands; splits across midnight
  if (start === end) return '';
  if (end > start) return `<div class="evband" style="left:${pct(start)}%;width:${pct(end - start)}%;background:${color}"></div>`;
  return `<div class="evband" style="left:${pct(start)}%;width:${pct(E.DAY - start)}%;background:${color}"></div>` +
         `<div class="evband" style="left:0;width:${pct(end)}%;background:${color}"></div>`;
}

function render(p) {
  const R = $('#results');
  const cut = HHMM(p.caffeineCutoff);

  // headline sleep card
  const sub = t('sleep_sub').replace('{h}', p.sleep.hours);
  const sleepcard = `<div class="sleepcard">
    <div class="moon">🌙</div>
    <div>
      <div class="tag">${esc(t('sleep_tag'))}</div>
      <div class="big">${esc(p.headline.sleepStartHHMM)} – ${esc(p.headline.sleepEndHHMM)}</div>
      <div class="sub">${esc(sub)}</div>
    </div>
    <div class="typebadge">${esc(t('type_' + p.type))}</div>
  </div>`;

  // ordered present events
  const present = EV_ORDER.filter(k => p.events.some(e => e.key === k))
    .map(k => ({ k, e: p.events.find(e => e.key === k) }));

  // timeline
  const axis = `<div class="axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>`;
  const rows = present.map(({ k, e }) => {
    const meta = EV_META[k];
    return `<div class="evrow">
      <div class="evlabel"><span class="ic" style="background:${meta.color}"></span><b>${esc(t('ev_' + k))}</b></div>
      <div class="evtrack"><div class="grid"></div>${bandHTML(e.start, e.end, meta.color)}</div>
    </div>`;
  }).join('');
  const timeline = `<div class="tl"><h3>${esc(t('tl_title'))}</h3>${axis}${rows}</div>`;

  // detail cards
  const cards = present.map(({ k, e }) => {
    const meta = EV_META[k];
    const why = (t('why_' + k) || '').replace('{cut}', cut);
    const timeStr = k === 'caffeine' ? `→ ${HHMM(e.end)}` : `${HHMM(e.start)} – ${HHMM(e.end)}`;
    return `<div class="dcard" style="border-left-color:${meta.border}">
      <div class="dt">${meta.icon} ${esc(t('ev_' + k))}<span class="dtime">${esc(timeStr)}</span></div>
      <div class="dwhy">${esc(why)}</div>
    </div>`;
  }).join('');
  const cardsBlock = `<div class="cards">${cards}</div>`;

  const toolbar = `<div class="toolbar"><button class="btn" id="copyPlan">${esc(t('copy'))}</button></div>`;

  R.innerHTML = sleepcard + timeline + cardsBlock + toolbar;
  R.classList.add('show');
  $('#copyPlan').addEventListener('click', e => copyPlan(e.target));
}

async function copyPlan(btn) {
  const p = last, cut = HHMM(p.caffeineCutoff);
  const L = [`ShiftRest — ${t('type_' + p.type)}`,
    `${t('sleep_tag')}: ${p.headline.sleepStartHHMM} – ${p.headline.sleepEndHHMM} (${p.sleep.hours}h)`, ''];
  EV_ORDER.filter(k => p.events.some(e => e.key === k)).forEach(k => {
    const e = p.events.find(x => x.key === k);
    const ts = k === 'caffeine' ? `until ${HHMM(e.end)}` : `${HHMM(e.start)}–${HHMM(e.end)}`;
    L.push(`• ${t('ev_' + k)} (${ts}): ${(t('why_' + k) || '').replace('{cut}', cut)}`);
  });
  const txt = L.join('\n');
  try { await navigator.clipboard.writeText(txt); } catch (e) {
    const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e2) {} ta.remove();
  }
  const old = btn.textContent; btn.textContent = t('copied'); setTimeout(() => btn.textContent = old, 1500);
}

/* ===================== language ===================== */
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  $$('[data-i]').forEach(el => {
    const k = el.dataset.i;
    if (k === 'h1') { const a = t('h1'); el.innerHTML = `${esc(a[0])}<em>${esc(a[1])}</em>${esc(a[2])}`; return; }
    const v = t(k);
    if (k === 'lede') el.innerHTML = v; else el.textContent = v;
  });
  // presets labels
  $$('#presets .preset').forEach(b => b.textContent = t(b.dataset.k));
  $$('.langs button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  try { localStorage.setItem('shiftrest_lang', lang); } catch (e) {}
  if (last) render(last);
}

/* ===================== init ===================== */
function init() {
  try {
    const saved = localStorage.getItem('shiftrest_lang');
    lang = (saved && I18N[saved]) ? saved : 'en';  // English-first public face; zh/uk via switcher (persisted)
  } catch (e) {}

  // build presets
  $('#presets').innerHTML = Object.keys(PRESETS).map(k => `<button class="preset" data-k="${k}">${esc(t(k))}</button>`).join('');

  applyLang();

  $$('.langs button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lang; applyLang(); }));
  ['shiftStart', 'shiftEnd', 'nap'].forEach(id => { $('#' + id).addEventListener('input', recompute); $('#' + id).addEventListener('change', recompute); });
  $('#sleepHours').addEventListener('input', () => { $('#sleepVal').textContent = $('#sleepHours').value + 'h'; recompute(); });
  $$('#presets .preset').forEach(b => b.addEventListener('click', () => {
    const [s, e] = PRESETS[b.dataset.k]; $('#shiftStart').value = s; $('#shiftEnd').value = e; recompute();
  }));

  recompute(); // initial plan from default 19:00-07:00
}
init();
