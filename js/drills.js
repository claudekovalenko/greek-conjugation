/* drills.js — turns the paradigm data into drillable questions.
   Ambiguous forms are grouped: τῶν is one question with several right answers,
   not three questions you can only get one-third right. */
var GK = window.GK || {}; window.GK = GK;

GK.drills = (function () {
  'use strict';

  var U = GK.util;

  var FIELD_DEFS = {
    tense: { label: 'tense', opts: ['present', 'imperfect', 'future', 'aorist', 'perfect', 'pluperfect'], labels: GK.TENSE_LABEL },
    voice: { label: 'voice', opts: ['active', 'middle', 'passive', 'mp'], labels: GK.VOICE_LABEL },
    mood: { label: 'mood', opts: ['indicative', 'subjunctive', 'imperative', 'infinitive', 'participle'],
      labels: { indicative: 'indicative', subjunctive: 'subjunctive', imperative: 'imperative', infinitive: 'infinitive', participle: 'participle' } },
    person: { label: 'person', opts: ['1', '2', '3'], labels: { '1': '1st', '2': '2nd', '3': '3rd' } },
    number: { label: 'number', opts: ['sg', 'pl'], labels: GK.NUMBER_LABEL },
    'case': { label: 'case', opts: ['nom', 'gen', 'dat', 'acc', 'voc'], labels: GK.CASE_LABEL },
    gender: { label: 'gender', opts: ['m', 'f', 'n'], labels: GK.GENDER_LABEL }
  };

  var FIELD_ORDER = ['tense', 'voice', 'mood', 'person', 'case', 'number', 'gender'];

  /* ---------- parse-string reader (used for reading passages) ---------- */

  var TOKENS = {
    nom: ['case', 'nom'], gen: ['case', 'gen'], dat: ['case', 'dat'],
    acc: ['case', 'acc'], voc: ['case', 'voc'],
    sg: ['number', 'sg'], pl: ['number', 'pl'],
    masc: ['gender', 'm'], fem: ['gender', 'f'], neut: ['gender', 'n'],
    pres: ['tense', 'present'], impf: ['tense', 'imperfect'], fut: ['tense', 'future'],
    aor: ['tense', 'aorist'], perf: ['tense', 'perfect'], plupf: ['tense', 'pluperfect'],
    act: ['voice', 'active'], mid: ['voice', 'middle'], pass: ['voice', 'passive'], mp: ['voice', 'mp'],
    ind: ['mood', 'indicative'], subj: ['mood', 'subjunctive'], impv: ['mood', 'imperative'],
    inf: ['mood', 'infinitive'], ptc: ['mood', 'participle']
  };

  function readParse(str) {
    var out = {};
    String(str).split(/\s+/).forEach(function (tok) {
      var t = tok.replace(/[(),]/g, '');
      if (TOKENS[t]) { out[TOKENS[t][0]] = TOKENS[t][1]; return; }
      var m = /^([123])(sg|pl)$/.exec(t);
      if (m) { out.person = m[1]; out.number = m[2]; }
    });
    return out;
  }

  /* ---------- answer checking ---------- */

  function voiceOk(given, want) {
    if (given === want) return true;
    // The middle and passive are identical in form outside the aorist and
    // future, so accept either where the chart says "middle/passive".
    if (want === 'mp') return given === 'middle' || given === 'passive';
    if (given === 'mp') return want === 'middle' || want === 'passive';
    return false;
  }

  function combosMatch(given, want, fields) {
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (f === 'voice') { if (!voiceOk(given.voice, want.voice)) return false; }
      else if (given[f] !== want[f]) return false;
    }
    return true;
  }

  function checkParse(item, given) {
    for (var i = 0; i < item.answers.length; i++) {
      if (combosMatch(given, item.answers[i], item.fields)) return true;
    }
    return false;
  }

  function checkTyped(item, typed) {
    return U.answerMatches(typed, item.accepted);
  }

  function describe(combo, fields) {
    return fields.map(function (f) {
      var v = combo[f];
      if (v === undefined || v === null) return null;
      return FIELD_DEFS[f].labels[v] || v;
    }).filter(Boolean).join(' · ');
  }

  /* ---------- generators ---------- */

  function nominalItems() {
    var parseItems = [], produceItems = [];
    GK.nominals.forEach(function (entry) {
      var byForm = {};
      var genders = Object.keys(entry.forms);
      genders.forEach(function (g) {
        ['sg', 'pl'].forEach(function (n) {
          var row = entry.forms[g][n];
          if (!row) return;
          GK.CASES.forEach(function (c, ci) {
            var form = row[ci];
            if (!form) return;
            var combo = { 'case': c, number: n };
            if (!entry.genderless) combo.gender = g;
            var k = U.key(form);
            if (!byForm[k]) byForm[k] = { form: form, combos: [] };
            byForm[k].combos.push(combo);

            if (c !== 'voc') {
              var fields = entry.genderless ? ['case', 'number'] : ['case', 'number', 'gender'];
              produceItems.push({
                id: 'nq:' + entry.id + ':' + g + ':' + n + ':' + c,
                deck: deckOf(entry), mode: 'produce',
                question: {
                  instruction: describe(combo, fields) + ' of',
                  lemma: entry.lemma, gloss: entry.gloss, form: null,
                  source: categoryOf(entry)
                },
                accepted: U.variants(form),
                reveal: form + '  —  ' + describe(combo, fields),
                note: entry.note
              });
            }
          });
        });
      });

      Object.keys(byForm).forEach(function (k) {
        var b = byForm[k];
        var fields = entry.genderless ? ['case', 'number'] : ['case', 'number', 'gender'];
        parseItems.push({
          id: 'np:' + entry.id + ':' + k,
          deck: deckOf(entry), mode: 'parse',
          question: {
            instruction: 'Parse this form', form: b.form,
            lemma: entry.lemma, gloss: entry.gloss, source: categoryOf(entry)
          },
          fields: fields,
          answers: b.combos,
          reveal: b.combos.map(function (c) { return describe(c, fields); }).join('   or   '),
          note: entry.note
        });
      });
    });
    return parseItems.concat(produceItems);
  }

  // A label for the prompt that says what kind of word this is without
  // handing over the lexical form the learner is meant to work out.
  function categoryOf(entry) {
    if (entry.kind === 'article') return 'the article';
    if (entry.kind === 'adj') return entry.decl + ' adjective';
    if (entry.kind === 'pronoun') {
      return entry.decl === 'personal' ? 'personal pronoun' : 'pronoun · ' + entry.decl;
    }
    return entry.decl + ' declension noun';
  }

  function deckOf(entry) {
    if (entry.kind === 'article') return 'article';
    if (entry.kind === 'pronoun') return 'pronouns';
    if (entry.kind === 'adj') return 'adjectives';
    return 'nouns';
  }

  function verbItems() {
    var parseItems = [], produceItems = [];
    var SLOTS = ['1s', '2s', '3s', '1p', '2p', '3p'];

    GK.verbs.forEach(function (verb) {
      var byForm = {};

      verb.paradigms.forEach(function (par) {
        SLOTS.forEach(function (slot) {
          var form = par.forms[slot];
          if (!form) return;
          var combo = {
            tense: par.tense, voice: par.voice, mood: par.mood,
            person: slot[0], number: slot[1] === 's' ? 'sg' : 'pl'
          };
          var k = U.key(form);
          if (!byForm[k]) byForm[k] = { form: form, combos: [] };
          byForm[k].combos.push(combo);

          produceItems.push({
            id: 'vq:' + verb.id + ':' + par.tense + ':' + par.voice + ':' + par.mood + ':' + slot,
            deck: 'verbs', mode: 'produce',
            question: {
              instruction: describe(combo, ['person', 'number', 'tense', 'voice', 'mood']) + ' of',
              lemma: verb.lemma, gloss: verb.gloss, form: null,
              source: verb.klass
            },
            accepted: U.variants(form),
            reveal: form + '  —  ' + describe(combo, ['person', 'number', 'tense', 'voice', 'mood']),
            note: par.note || verb.note
          });
        });
      });

      (verb.infinitives || []).forEach(function (inf) {
        var combo = { tense: inf.tense, voice: inf.voice, mood: 'infinitive' };
        var k = U.key(inf.form);
        if (!byForm[k]) byForm[k] = { form: inf.form, combos: [] };
        byForm[k].combos.push(combo);
      });

      (verb.participles || []).forEach(function (p) {
        var combo = { tense: p.tense, voice: p.voice, mood: 'participle' };
        var k = U.key(p.forms[0]);
        if (!byForm[k]) byForm[k] = { form: p.forms[0], combos: [] };
        byForm[k].combos.push(combo);
      });

      Object.keys(byForm).forEach(function (k) {
        var b = byForm[k];
        // Every combo for one surface shares the same shape of answer, so use
        // the widest set of fields any of them needs.
        var needsPerson = b.combos.some(function (c) { return c.person; });
        var fields = needsPerson
          ? ['tense', 'voice', 'mood', 'person', 'number']
          : ['tense', 'voice', 'mood'];
        parseItems.push({
          id: 'vp:' + verb.id + ':' + k,
          deck: 'verbs', mode: 'parse',
          question: {
            instruction: 'Parse this verb', form: b.form,
            lemma: verb.lemma, gloss: verb.gloss, source: verb.klass
          },
          fields: fields,
          // A surface shared by a finite form and a participle keeps only the
          // combos that can actually answer the fields being asked.
          answers: b.combos.filter(function (c) {
            return fields.every(function (f) { return c[f] !== undefined; });
          }).map(function (c) {
            var out = {};
            fields.forEach(function (f) { out[f] = c[f]; });
            return out;
          }),
          reveal: b.combos.map(function (c) { return describe(c, fields); }).join('   or   '),
          note: verb.note
        });
      });
    });
    return parseItems.concat(produceItems);
  }

  function principalPartItems() {
    var items = [];
    GK.principalParts.forEach(function (pp) {
      pp.parts.forEach(function (part, i) {
        if (!part || part === '—' || i === 0) return;
        items.push({
          id: 'pp:' + pp.lemma + ':' + i,
          deck: 'principalparts', mode: 'produce',
          question: {
            instruction: GK.PP_LABELS[i] + ' of',
            lemma: pp.lemma, gloss: pp.gloss, form: null,
            source: 'principal part ' + (i + 1)
          },
          accepted: U.variants(part),
          reveal: pp.parts.join('  ·  ')
        });
      });
    });
    return items;
  }

  function vocabItems() {
    var items = [];
    GK.vocab.forEach(function (v) {
      var head = v.g.split(',')[0].trim();
      items.push({
        id: 'vg:' + head,
        deck: 'vocab', mode: 'recall',
        question: { instruction: 'What does this mean?', form: v.g, source: v.pos },
        reveal: v.e,
        meta: 'about ' + v.freq + '× in the NT'
      });
      items.push({
        id: 've:' + head,
        deck: 'vocab', mode: 'produce',
        question: { instruction: 'Give the Greek for', lemma: v.e, gloss: null, form: null, source: v.pos },
        accepted: [head],
        reveal: v.g + '  —  ' + v.e
      });
    });
    return items;
  }

  function readingItems() {
    var items = [];
    GK.passages.forEach(function (p) {
      p.words.forEach(function (w, i) {
        var combo = readParse(w[2]);
        var fields = [];
        if (combo.mood === 'participle') fields = ['tense', 'voice', 'case', 'number', 'gender'];
        else if (combo.mood === 'infinitive') fields = ['tense', 'voice'];
        else if (combo.tense) fields = ['tense', 'voice', 'mood', 'person', 'number'];
        else if (combo['case']) fields = combo.gender ? ['case', 'number', 'gender'] : ['case', 'number'];
        if (!fields.length) return;
        if (fields.some(function (f) { return !combo[f]; })) return;

        var answer = {};
        fields.forEach(function (f) { answer[f] = combo[f]; });
        items.push({
          id: 'rp:' + p.id + ':' + i,
          deck: 'reading', mode: 'parse',
          question: {
            instruction: combo.mood === 'participle' ? 'Parse this participle'
              : combo.mood === 'infinitive' ? 'Parse this infinitive'
              : 'Parse this word',
            form: w[0].replace(/[.,;·:!?]+$/, ''),
            lemma: w[3], gloss: w[1], source: p.ref
          },
          fields: fields,
          answers: [answer],
          reveal: combo.mood === 'participle'
            ? describe(answer, ['tense', 'voice']) + ' participle  ·  ' + describe(answer, ['case', 'number', 'gender'])
            : combo.mood === 'infinitive'
              ? describe(answer, ['tense', 'voice']) + ' infinitive'
              : describe(answer, fields),
          note: p.note
        });
      });
    });
    return items;
  }

  /* ---------- pool assembly ---------- */

  var cache = null;

  function all() {
    if (cache) return cache;
    cache = []
      .concat(nominalItems())
      .concat(verbItems())
      .concat(principalPartItems())
      .concat(vocabItems())
      .concat(readingItems());
    return cache;
  }

  GK.DECKS = [
    { id: 'article', name: 'The article', blurb: 'ὁ ἡ τό — every case, gender and number' },
    { id: 'nouns', name: 'Nouns', blurb: '1st, 2nd and 3rd declension' },
    { id: 'adjectives', name: 'Adjectives', blurb: 'ἀγαθός and πᾶς' },
    { id: 'pronouns', name: 'Pronouns', blurb: 'αὐτός, οὗτος, ὅς, ἐγώ, σύ, τίς' },
    { id: 'verbs', name: 'Verbs', blurb: 'all six tenses, three moods, three voices' },
    { id: 'principalparts', name: 'Principal parts', blurb: 'the six forms behind every verb' },
    { id: 'vocab', name: 'Vocabulary', blurb: '146 of the most common NT words' },
    { id: 'reading', name: 'Words from your reading', blurb: 'parsed straight out of the passages' }
  ];

  function pool(opts) {
    opts = opts || {};
    var decks = opts.decks || GK.DECKS.map(function (d) { return d.id; });
    var modes = opts.modes || ['parse', 'produce', 'recall'];
    return all().filter(function (it) {
      return decks.indexOf(it.deck) !== -1 && modes.indexOf(it.mode) !== -1;
    });
  }

  function byId(id) {
    var list = all();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  return {
    pool: pool, all: all, byId: byId,
    checkParse: checkParse, checkTyped: checkTyped,
    describe: describe, readParse: readParse,
    FIELD_DEFS: FIELD_DEFS, FIELD_ORDER: FIELD_ORDER
  };
})();
