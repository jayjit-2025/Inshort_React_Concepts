import { JSDOM } from 'jsdom';

const consoleMessages = [];
const originalError = console.error;
const originalWarn = console.warn;
console.error = (...args) => {
  consoleMessages.push(args.map(String).join(' '));
  originalError(...args);
};
console.warn = (...args) => {
  consoleMessages.push(args.map(String).join(' '));
  originalWarn(...args);
};

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (!(key in globalThis)) {
    try {
      globalThis[key] = dom.window[key];
    } catch {
      // skip read-only globals
    }
  }
}
if (!dom.window.crypto.randomUUID) {
  dom.window.crypto.randomUUID = () => `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

const { createServer } = await import('vite');
const vite = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const { default: App } = await vite.ssrLoadModule('/src/App.tsx');
const React = (await import('react')).default;
const { createRoot } = await import('react-dom/client');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate, message, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (predicate()) return;
    await sleep(30);
  }
  throw new Error(`Timed out waiting for: ${message}`);
}

let passed = 0;
let failed = 0;

function check(condition, label) {
  if (condition) {
    passed += 1;
    console.log(`  PASS ${label}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${label}`);
  }
}

function click(el) {
  if (!el) throw new Error('click target missing');
  el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

function setInput(el, value) {
  if (!el) throw new Error('input target missing');
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set;
  setter.call(el, value);
  el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
}

function section(id) {
  return document.getElementById(id);
}

function findButton(rootEl, text) {
  return [...rootEl.querySelectorAll('button')].find((b) => b.textContent.trim().includes(text));
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(React.createElement(App));

await waitFor(() => container.textContent.includes('React Mastery Tutorial'), 'app mount');
console.log('APP SHELL');
check(container.querySelectorAll('.nav-link').length === 9, 'nav shows dashboard + 8 concept links');
check(container.querySelectorAll('.concept-card').length === 8, 'dashboard shows 8 concept cards');
check(container.textContent.includes('Not started'), 'concept cards show initial status');
check(container.textContent.includes('0 / 8'), 'progress starts at 0 / 8');
check(Boolean(section('mental-model')), 'mental model section exists');
check(section('mental-model').querySelectorAll('.mental-node').length === 8, 'mental model connects 8 concepts');
check(Boolean(document.querySelector('.nav-progress')), 'nav shows progress pill');
const sectionIds = [
  'useState',
  'useEffect',
  'props-composition',
  'conditional-rendering',
  'lists-keys',
  'events-forms',
  'context',
  'custom-hooks',
];
for (const id of sectionIds) {
  check(Boolean(section(id)), `section #${id} exists`);
}
for (const id of sectionIds) {
  check(Boolean(section(id).querySelector('.quiz-option')), `section #${id} has a verification activity`);
  check(Boolean(section(id).querySelector('.debug-list')), `section #${id} has debugging insight`);
  check(Boolean(section(id).querySelector('.explanation')), `section #${id} has short explanation`);
  check(Boolean(section(id).querySelector('.concept-footer')), `section #${id} has prev/next footer`);
}
const navLinks = [...container.querySelectorAll('.nav-link')];
check(
  navLinks.every((link) => document.querySelector(link.getAttribute('href'))),
  'every nav link targets an existing section'
);
for (let i = 0; i < sectionIds.length; i++) {
  const footer = section(sectionIds[i]).querySelector('.concept-footer');
  const nextHref = i < sectionIds.length - 1 ? `#${sectionIds[i + 1]}` : '#mental-model';
  const prevHref = i > 0 ? `#${sectionIds[i - 1]}` : '#dashboard';
  check(Boolean(footer.querySelector(`a[href="${nextHref}"]`)), `concept footer ${i + 1} links forward`);
  check(Boolean(footer.querySelector(`a[href="${prevHref}"]`)), `concept footer ${i + 1} links backward`);
}
check(
  Boolean(document.querySelector('.concept-card[href="#useState"]')),
  'dashboard card links to its concept'
);

console.log('MODULE 1 useState');
const s1 = section('useState');
check(s1.querySelector('.big-value').textContent.trim() === '0', 'counter starts at 0');
click(findButton(s1, 'Increase'));
await waitFor(() => s1.querySelector('.big-value').textContent.trim() === '1', 'counter increments');
check(s1.textContent.includes('count = 1'), 'state readout shows count = 1');
check(s1.textContent.includes('#2'), 'render count advanced to #2');
click(findButton(s1, 'Reset'));
await waitFor(() => s1.querySelector('.big-value').textContent.trim() === '0', 'reset works');
click(s1.querySelector('.quiz-option'));
await waitFor(() => s1.querySelector('.quiz-feedback'), 'quiz feedback appears');
check(s1.querySelector('.quiz-feedback').classList.contains('correct'), 'first quiz answer is correct');
await waitFor(() => container.textContent.includes('1 / 8'), 'progress updates to 1 / 8 after correct quiz');
check(
  Boolean(dom.window.localStorage.getItem('react-mastery-progress')?.includes('useState')),
  'progress persisted to localStorage'
);
check(s1.textContent.includes('Completed'), 'footer status chip flips to Completed');
check(s1.textContent.includes('Verified'), 'verification badge flips to Verified');
check(Boolean(s1.querySelector('.concept-footer a[href="#useEffect"]')), 'footer links to next concept');
check(
  Boolean(section('custom-hooks').querySelector('.concept-footer a[href="#mental-model"]')),
  'last concept footer links to mental model'
);

console.log('MODULE 2 useEffect');
const s2 = section('useEffect');
check(s2.textContent.includes('clock effect — interval started'), 'clock effect logged on mount');
check(s2.textContent.includes('effect run #1'), 'sensor effect logged on mount');
click(findButton(s2, 'Change dependency value'));
await waitFor(() => s2.textContent.includes('cleanup after run #1'), 'cleanup logged on dependency change');
check(s2.textContent.includes('effect run #2'), 'effect re-ran after dependency change');
click(findButton(s2, 'Re-render only'));
await sleep(100);
check(s2.querySelector('.log-list').textContent.match(/effect run #\d+/g).length === 2, 're-render alone did not re-run effect');
click(findButton(s2, 'Run simulation'));
await waitFor(() => s2.textContent.includes('Problem detected'), 'capped bad example warning appears', 8000);
check(s2.textContent.includes('capped at 8'), 'bad example capped at 8 runs');

console.log('MODULE 3 props');
const s3 = section('props-composition');
setInput(s3.querySelector('#props-name'), 'Grace Hopper');
await waitFor(() => s3.textContent.includes('Grace Hopper'), 'prop change flows to UserCard');
check(s3.textContent.includes('Data owner'), 'ownership stats shown');
click(s3.querySelector('.quiz-option'));
await waitFor(() => s3.querySelector('.quiz-feedback.correct'), 'props quiz answer correct');

console.log('MODULE 4 conditional rendering');
const s4 = section('conditional-rendering');
const errorBtn = [...s4.querySelectorAll('.segmented button')].find((b) => b.textContent.trim() === 'Error');
click(errorBtn);
await waitFor(() => s4.textContent.includes('Could not load profile'), 'error UI rendered');
check(!s4.textContent.includes('Loading profile…'), 'only error state is shown');
click(findButton(s4, 'Try again'));
await waitFor(() => s4.textContent.includes('Loading profile…'), 'retry shows loading');
await waitFor(() => s4.textContent.includes('Jay Doe'), 'retry resolves to success');
check(s4.textContent.includes('Exactly 1'), 'stat confirms single state');

console.log('MODULE 5 lists + keys');
const s5 = section('lists-keys');
click([...s5.querySelectorAll('.segmented button')].find((b) => b.textContent.includes('Array index')));
click(s5.querySelector('[aria-label="Delete Bravo"]'));
await waitFor(() => s5.textContent.includes('state followed position'), 'index-key mismatch badge appears');
click([...s5.querySelectorAll('.segmented button')].find((b) => b.textContent.includes('Stable ID')));
await sleep(50);
check(!s5.textContent.includes('state followed position'), 'no mismatch with stable id keys after reset strategy');

console.log('MODULE 6 events + forms');
const s6 = section('events-forms');
click(findButton(s6, 'Submit'));
await waitFor(() => s6.textContent.includes('Name is required.'), 'empty submit shows validation error');
setInput(s6.querySelector('#form-name'), 'Ada Lovelace');
setInput(s6.querySelector('#form-email'), 'not-an-email');
click(findButton(s6, 'Submit'));
await waitFor(() => s6.textContent.includes('Enter a valid email address.'), 'invalid email rejected');
setInput(s6.querySelector('#form-email'), 'ada@example.com');
click(findButton(s6, 'Submit'));
await waitFor(() => s6.textContent.includes('form state: success'), 'valid submit succeeds', 4000);
check(s6.textContent.includes('Ada Lovelace'), 'record list contains the submission');
const plainPanel = [...s6.querySelectorAll('h4')].find((h) => h.textContent === 'Plain handler').parentElement;
const stablePanel = [...s6.querySelectorAll('h4')].find((h) => h.textContent === 'useCallback handler').parentElement;
const childRenders = (panel) => panel.querySelector('.stat-accent .stat-value').textContent;
const plainBefore = childRenders(plainPanel);
const stableBefore = childRenders(stablePanel);
click(findButton(s6, 'Re-render parent'));
await sleep(100);
check(
  childRenders(plainPanel) !== plainBefore && Number(childRenders(plainPanel).slice(1)) === Number(plainBefore.slice(1)) + 1,
  'plain-handler child re-rendered'
);
check(childRenders(stablePanel) === stableBefore, 'useCallback child skipped re-render');
const computeBefore = [...s6.querySelectorAll('.stat-accent .stat-value')].map((el) => el.textContent);
click(findButton(s6, 'Re-render only'));
await sleep(100);
check(s6.textContent.includes('Times computed'), 'useMemo compute counter visible');

console.log('MODULE 7 context');
const s7 = section('context');
click([...s7.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Dark'));
await waitFor(() => s7.textContent.includes('theme = dark'), 'context theme switches to dark');
check(s7.textContent.includes('read via useContext'), 'consumers show useContext badge');

console.log('MODULE 8 custom hooks');
const s8 = section('custom-hooks');
setInput(s8.querySelector('#note-input'), 'Persisted note');
click(findButton(s8, 'Add note'));
await waitFor(() => s8.textContent.includes('Persisted note'), 'note added');
const stored = dom.window.localStorage.getItem('react-mastery-notes');
check(Boolean(stored && stored.includes('Persisted note')), 'note persisted to localStorage');
setInput(s8.querySelector('#draft-input'), 'draft text');
await waitFor(() => dom.window.localStorage.getItem('react-mastery-draft') === '"draft text"', 'draft persisted');
const timesComputed = () =>
  [...s8.querySelectorAll('.stat')].find((el) => el.textContent.includes('Times computed')).querySelector('.stat-value')
    .textContent;
const computeCount = timesComputed();
click(findButton(s8, 'Re-render only'));
await sleep(100);
check(timesComputed() === computeCount, 're-render alone does not recompute (useMemo)');
click(findButton(s8, 'Change notes (clear)'));
await waitFor(() => timesComputed() !== String(computeCount), 'changing notes recomputes');
check(!s8.textContent.includes('Persisted note'), 'clear all removes notes');

root.unmount();
await vite.close();
dom.window.close();

if (consoleMessages.length > 0) {
  consoleMessages.forEach((message) => console.log(`  CONSOLE: ${message}`));
}
check(consoleMessages.length === 0, 'no console errors or warnings during the whole session');

console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
