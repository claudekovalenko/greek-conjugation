#!/usr/bin/env node
/* test.js — data integrity checks. No dependencies; run with `node test.js`.
   These guard the things that are easy to break by hand-editing the data:
   a malformed word tuple, a duplicate id, a paradigm row of the wrong length,
   a memory hook that would fire on a form it is not true of. */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = ['util', 'data-nominals', 'data-verbs', 'data-vocab',
  'data-mnemonics', 'data-reading', 'srs', 'drills'];

// Minimal browser surface: the modules only reach for window and localStorage.
const store = {};
const sandbox = {
  window: {}, document: undefined,
  localStorage: {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    key: i => Object.keys(store)[i] ?? null,
    get length() { return Object.keys(store).length; }
  }
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of SRC) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'js', f + '.js'), 'utf8'), sandbox, { filename: f + '.js' });
}
const GK = sandbox.window.GK;

let failures = 0;
const checks = [];
function check(name, fn) { checks.push([name, fn]); }
function fail(msg) { throw new Error(msg); }

/* ---------- data shape ---------- */

check('every paradigm row has one slot per case', () => {
  for (const n of GK.nominals) {
    for (const g of Object.keys(n.forms)) {
      for (const num of ['sg', 'pl']) {
        const row = n.forms[g][num];
        if (!row) fail(`${n.id}: missing ${g} ${num}`);
        if (row.length !== GK.CASES.length) {
          fail(`${n.id} ${g} ${num}: ${row.length} entries, expected ${GK.CASES.length}`);
        }
      }
    }
  }
});

check('every nominal declares a gender the paradigm actually has', () => {
  for (const n of GK.nominals) {
    const gs = Object.keys(n.forms);
    if (!gs.length) fail(`${n.id}: no genders`);
    for (const g of gs) if (!['m', 'f', 'n'].includes(g)) fail(`${n.id}: bad gender key "${g}"`);
  }
});

check('every verb paradigm uses known tense/voice/mood values', () => {
  for (const v of GK.verbs) {
    for (const p of v.paradigms) {
      if (!GK.TENSES.includes(p.tense)) fail(`${v.id}: unknown tense ${p.tense}`);
      if (!GK.VOICES.includes(p.voice)) fail(`${v.id}: unknown voice ${p.voice}`);
      if (!GK.MOODS.includes(p.mood)) fail(`${v.id}: unknown mood ${p.mood}`);
      const slots = Object.keys(p.forms);
      if (!slots.length) fail(`${v.id} ${p.tense} ${p.voice} ${p.mood}: no forms`);
      for (const sl of slots) {
        if (!/^[123][sp]$/.test(sl)) fail(`${v.id}: bad slot "${sl}"`);
      }
      if (p.mood === 'imperative' && slots.includes('1s')) {
        fail(`${v.id}: imperatives have no first person`);
      }
    }
  }
});

check('every verb lists six principal parts', () => {
  for (const v of GK.verbs) {
    if (v.principalParts.length !== 6) fail(`${v.id}: ${v.principalParts.length} principal parts`);
  }
  for (const p of GK.principalParts) {
    if (p.parts.length !== 6) fail(`${p.lemma}: ${p.parts.length} principal parts`);
  }
});

check('every reading word is [surface, gloss, parse, lexical form]', () => {
  for (const p of GK.passages) {
    if (!p.words.length) fail(`${p.id}: no words`);
    p.words.forEach((w, i) => {
      if (w.length !== 4) fail(`${p.ref} word ${i}: ${w.length} fields, expected 4`);
      w.forEach((field, j) => {
        if (typeof field !== 'string' || !field.trim()) {
          fail(`${p.ref} word ${i} field ${j}: empty`);
        }
      });
    });
    if (![1, 2, 3].includes(p.level)) fail(`${p.id}: level must be 1-3`);
    if (!p.en || !p.ref || !p.title) fail(`${p.id}: missing ref, title or English`);
  }
});

check('every reading parse string is understood', () => {
  // Anything the parser cannot read must be an indeclinable we accept on purpose.
  const INDECLINABLE = /^(conj|adv|particle|prep \+(gen|dat|acc))$/;
  const bad = [];
  for (const p of GK.passages) {
    for (const w of p.words) {
      const parsed = GK.drills.readParse(w[2]);
      if (!Object.keys(parsed).length && !INDECLINABLE.test(w[2])) {
        bad.push(`${p.ref}: "${w[0]}" has unreadable parse "${w[2]}"`);
      }
    }
  }
  if (bad.length) fail(bad.slice(0, 8).join('\n  '));
});

check('reading parses are internally consistent', () => {
  const bad = [];
  for (const p of GK.passages) {
    for (const w of p.words) {
      const a = GK.drills.readParse(w[2]);
      if (a.person && a.case) bad.push(`${p.ref} "${w[0]}": both a person and a case`);
      if (a.mood === 'participle' && !a.case) bad.push(`${p.ref} "${w[0]}": participle with no case`);
      if (a.tense && !a.voice) bad.push(`${p.ref} "${w[0]}": tense with no voice`);
      if (a.case && !a.number) bad.push(`${p.ref} "${w[0]}": case with no number`);
    }
  }
  if (bad.length) fail(bad.slice(0, 8).join('\n  '));
});

/* ---------- generated questions ---------- */

check('question ids are unique', () => {
  const seen = new Set();
  for (const it of GK.drills.all()) {
    if (seen.has(it.id)) fail(`duplicate id ${it.id}`);
    seen.add(it.id);
  }
});

check('every question can actually be answered', () => {
  for (const it of GK.drills.all()) {
    if (it.mode === 'parse') {
      if (!it.fields || !it.fields.length) fail(`${it.id}: no fields to answer`);
      if (!it.answers || !it.answers.length) fail(`${it.id}: no accepted answer`);
      for (const a of it.answers) {
        for (const f of it.fields) {
          if (a[f] === undefined) fail(`${it.id}: answer missing "${f}"`);
        }
      }
    } else if (it.mode === 'produce') {
      if (!it.accepted || !it.accepted.length) fail(`${it.id}: nothing accepted`);
      if (it.accepted.some(a => !a || !a.trim())) fail(`${it.id}: blank accepted answer`);
      if (it.accepted.some(a => /[()]/.test(a))) fail(`${it.id}: unexpanded parentheses in "${it.accepted}"`);
    }
    if (!it.reveal || !it.reveal.trim()) fail(`${it.id}: nothing to reveal`);
  }
});

check('the reveal of a parse question matches one of its answers', () => {
  for (const it of GK.drills.all()) {
    if (it.mode !== 'parse') continue;
    if (!GK.drills.checkParse(it, it.answers[0])) fail(`${it.id}: own answer rejected`);
  }
});

check('a produce answer is accepted with and without accents', () => {
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
  for (const it of GK.drills.all()) {
    if (it.mode !== 'produce') continue;
    const want = it.accepted[0];
    if (!GK.drills.checkTyped(it, want)) fail(`${it.id}: rejects its own answer "${want}"`);
    if (!GK.drills.checkTyped(it, strip(want))) fail(`${it.id}: rejects unaccented "${strip(want)}"`);
  }
});

check('typing in Latin letters works', () => {
  const cases = [['luomen', 'λύομεν'], ['logos', 'λόγος'], ['hmera', 'ἡμέρα'], ['anthrwpos', 'ἄνθρωπος']];
  for (const [latin, greek] of cases) {
    const fake = { accepted: [greek] };
    if (!GK.drills.checkTyped(fake, latin)) fail(`"${latin}" not accepted for ${greek}`);
  }
});

/* ---------- memory hooks ---------- */

check('every hook belongs to a declared section', () => {
  const ids = new Set(GK.mnemonicSections.map(s => s.id));
  for (const m of GK.mnemonics) {
    if (!ids.has(m.section)) fail(`${m.id}: unknown section "${m.section}"`);
    if (!m.title || !m.hook || !m.why) fail(`${m.id}: missing title, hook or why`);
    if (!Array.isArray(m.tags)) fail(`${m.id}: tags must be an array`);
  }
});

check('hook ids are unique', () => {
  const seen = new Set();
  for (const m of GK.mnemonics) {
    if (seen.has(m.id)) fail(`duplicate hook id ${m.id}`);
    seen.add(m.id);
  }
});

check('no hook fires on a form it is not true of', () => {
  // Spot-checks for the rules that are easiest to get subtly wrong.
  const find = f => GK.drills.all().find(i => i.mode === 'parse' && i.question.form === f);
  const hooks = (form, n) => {
    const it = find(form);
    if (!it) fail(`test form ${form} not in the pool`);
    return GK.drills.mnemonicsFor(it, n || 4).map(m => m.id);
  };
  const mustNot = (form, id) => {
    if (hooks(form).includes(id)) fail(`"${id}" fired on ${form}, where it is not true`);
  };
  const must = (form, id) => {
    if (!hooks(form).includes(id)) fail(`"${id}" did not fire on ${form}`);
  };

  // σα is the first aorist indicative only.
  mustNot('ἔβαλον', 'sa-aorist');          // second aorist: no σα at all
  mustNot('λύσω', 'sa-aorist');            // aorist subjunctive: no augment
  must('ἔλυσα', 'sa-aorist');

  // The augment is indicative-only.
  mustNot('λύσωμεν', 'augment');
  mustNot('λῦσον', 'augment');
  must('ἔλυσα', 'augment');
  must('λύσωμεν', 'no-augment-outside-ind');

  // Voice and ending-set rules.
  must('ἐλύθησαν', 'aor-pass-active-endings');
  must('ἐλύθησαν', 'theta-passive');
  must('λύωμεν', 'subj-long');
  must('ἔβαλον', 'second-aorist');

  // Nominal rules.
  must('τῶν', 'gen-pl');
  must('ἔργα', 'neuter');
  must('ὀνόματος', 'third-stem');

  // Ambiguity is flagged only where the form really is ambiguous.
  must('λύσω', 'ambiguity');
  mustNot('λύομεν', 'ambiguity');
});

check('a missed field pulls up the hook that explains it', () => {
  const it = GK.drills.all().find(i => i.mode === 'parse' && i.question.form === 'ἐλύθησαν');
  if (!it) fail('test form not in the pool');
  const ids = f => GK.drills.mnemonicsFor(it, 3, f).map(m => m.id);
  const onVoice = ids(['voice']);
  if (onVoice.indexOf('theta-passive') === -1) fail('θη hook missing when the voice was missed');
  if (onVoice.indexOf('theta-passive') > onVoice.indexOf('augment')) {
    fail('missing the voice should rank the voice hook above the augment hook');
  }
  // wrongFields must name the field, not just report a miss
  const picked = { tense: 'aorist', voice: 'active', mood: 'indicative', person: '3', number: 'pl' };
  const wrong = GK.drills.wrongFields(it, picked);
  if (wrong.join(',') !== 'voice') fail(`expected only "voice" to be wrong, got [${wrong}]`);
});

check('hooks reach a useful share of the questions', () => {
  const all = GK.drills.all().filter(i => i.mode === 'parse');
  const covered = all.filter(i => GK.drills.mnemonicsFor(i).length).length;
  const pct = Math.round(100 * covered / all.length);
  if (pct < 80) fail(`only ${pct}% of parse questions surface a hook`);
});

/* ---------- source syntax ---------- */

check('every script parses', () => {
  // app.js needs a DOM so it is never loaded above; this at least catches a
  // syntax error in it before the browser does.
  const files = fs.readdirSync(path.join(__dirname, 'js')).filter(f => f.endsWith('.js'));
  if (files.length < 9) fail(`only found ${files.length} scripts in js/`);
  for (const f of files.concat(['../build.js'])) {
    const full = path.join(__dirname, 'js', f);
    try {
      require('child_process').execFileSync(process.execPath, ['--check', full], { stdio: 'pipe' });
    } catch (e) {
      fail(`${f}: ${String(e.stderr || e).split('\n').slice(0, 3).join(' ')}`);
    }
  }
});

check('index.html loads every script in js/', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const listed = [...html.matchAll(/<script src="js\/([^"]+)"><\/script>/g)].map(m => m[1]);
  const onDisk = fs.readdirSync(path.join(__dirname, 'js')).filter(f => f.endsWith('.js'));
  for (const f of onDisk) {
    if (!listed.includes(f)) fail(`js/${f} exists but index.html never loads it`);
  }
  if (listed[listed.length - 1] !== 'app.js') fail('app.js must be loaded last');
});

/* ---------- the committed build ---------- */

check('dist/ matches the current source', () => {
  const before = ['dist/koine-drill.html', 'dist/embed.html']
    .map(f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
  require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'build.js')], { stdio: 'pipe' });
  const after = ['dist/koine-drill.html', 'dist/embed.html'].map(f => fs.readFileSync(f, 'utf8'));
  for (let i = 0; i < after.length; i++) {
    if (before[i] !== after[i]) fail('dist/ is stale — run `node build.js` and commit the result');
  }
});

/* ---------- run ---------- */

for (const [name, fn] of checks) {
  try {
    fn();
    console.log('  ok   ' + name);
  } catch (e) {
    failures++;
    console.log('  FAIL ' + name + '\n         ' + e.message.split('\n').join('\n         '));
  }
}

const counts = {
  questions: GK.drills.all().length,
  passages: GK.passages.length,
  'parsed words': GK.passages.reduce((a, p) => a + p.words.length, 0),
  hooks: GK.mnemonics.length,
  vocabulary: GK.vocab.length
};
console.log('\n' + Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(' · '));
console.log(failures ? `\n${failures} of ${checks.length} checks failed` : `\nall ${checks.length} checks passed`);
process.exit(failures ? 1 : 0);
