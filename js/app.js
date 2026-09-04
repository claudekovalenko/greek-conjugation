/* app.js — views, session runner, and all the DOM wiring. */
var GK = window.GK || {}; window.GK = GK;

GK.app = (function () {
  'use strict';

  var U = GK.util, D = GK.drills, S = GK.srs;
  var el = U.el;

  var VIEWS = [
    { id: 'today', label: 'Today', ic: '☀' },
    { id: 'drill', label: 'Drill', ic: '✎' },
    { id: 'read', label: 'Read', ic: '📖' },
    { id: 'learn', label: 'Learn', ic: '💡' },
    { id: 'progress', label: 'Progress', ic: '◔' }
  ];

  var prefs = U.load('prefs', {
    decks: ['article', 'nouns', 'adjectives', 'pronouns', 'verbs', 'principalparts', 'reading'],
    modes: ['parse'],
    length: 20,
    theme: 'auto'
  });

  var progress = U.load('progress', { days: {}, readingIndex: 0, todayPassage: null });

  var state = { view: 'today', session: null, passageId: null, wordIndex: null, readMode: 'plain' };

  function savePrefs() { U.save('prefs', prefs); }
  function saveProgress() { U.save('progress', progress); }

  function dayRec(iso) {
    if (!progress.days[iso]) progress.days[iso] = { answered: 0, right: 0, read: [] };
    return progress.days[iso];
  }

  function streak() {
    var n = 0, d = U.today();
    // Today doesn't break the streak until it's over, so start from yesterday
    // if nothing has been done yet today.
    if (!progress.days[d]) {
      d = shift(d, -1);
      if (!progress.days[d]) return 0;
    }
    while (progress.days[d]) { n++; d = shift(d, -1); }
    return n;
  }

  function shift(iso, n) {
    var dt = new Date(iso + 'T00:00:00');
    dt.setDate(dt.getDate() + n);
    return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
  }

  /* ---------- shell ---------- */

  var viewEl, tabsEl;

  function go(view) {
    state.view = view;
    if (view !== 'drill') state.session = null;
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    Array.prototype.forEach.call(tabsEl.children, function (b) {
      b.setAttribute('aria-selected', b.dataset.view === state.view ? 'true' : 'false');
    });
    viewEl.innerHTML = '';
    ({
      today: renderToday, drill: renderDrill, read: renderRead,
      learn: renderLearn, progress: renderProgress
    })[state.view](viewEl);
  }

  /* ---------- today ---------- */

  function todaysPassage() {
    var t = U.today();
    if (progress.todayPassage && progress.todayPassage.date === t) {
      var found = GK.passages.filter(function (p) { return p.id === progress.todayPassage.id; })[0];
      if (found) return found;
    }
    var p = GK.passages[progress.readingIndex % GK.passages.length];
    progress.todayPassage = { date: t, id: p.id };
    saveProgress();
    return p;
  }

  // Only material you have already met counts as "due" — otherwise day one
  // reports two thousand items due, which tells you nothing.
  function reviewDue() {
    return D.pool({ decks: prefs.decks, modes: prefs.modes }).filter(function (i) {
      var r = S.record(i.id);
      return r && r.seen > 0 && S.isDue(i.id);
    }).length;
  }

  function renderToday(root) {
    var p = todaysPassage();
    var t = U.today();
    var rec = progress.days[t];
    var readToday = rec && rec.read.indexOf(p.id) !== -1;

    root.appendChild(el('h1', { text: 'Καλημέρα' }));
    root.appendChild(el('p', { class: 'sub', text: new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) }));

    var stats = el('div', { class: 'card' }, [
      el('div', { class: 'streak' }, [
        el('div', { class: 'stat' }, [el('b', { text: String(streak()) }), el('span', { text: 'day streak' })]),
        el('div', { class: 'stat' }, [el('b', { text: String(rec ? rec.answered : 0) }), el('span', { text: 'today' })]),
        el('div', { class: 'stat' }, [el('b', { text: String(reviewDue()) }), el('span', { text: 'to review' })]),
        el('div', { class: 'stat' }, [el('b', { text: String(S.stats(D.all().map(function (i) { return i.id; })).learned) }), el('span', { text: 'learned' })])
      ])
    ]);
    root.appendChild(stats);

    /* reading */
    var preview = p.words.slice(0, 9).map(function (w) { return w[0]; }).join(' ') + (p.words.length > 9 ? ' …' : '');
    root.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'spread' }, [
        el('h3', { text: 'Today’s reading' }),
        el('span', { class: 'pill' + (readToday ? ' accent' : ''), text: readToday ? 'read ✓' : 'passage ' + ((progress.readingIndex % GK.passages.length) + 1) + ' of ' + GK.passages.length })
      ]),
      el('div', { class: 'spread' }, [
        el('div', {}, [
          el('div', { style: 'font-weight:650', text: p.ref }),
          el('div', { class: 'sub', text: p.title })
        ])
      ]),
      el('p', { class: 'gk', style: 'font-size:21px;line-height:1.7;margin:10px 0', text: preview }),
      el('div', { class: 'row' }, [
        el('button', { class: 'primary', text: 'Read it', onclick: function () { state.passageId = p.id; state.wordIndex = null; go('read'); } }),
        el('button', {
          text: 'Drill these words',
          onclick: function () { startSession(passageItems(p.id), 'Words from ' + p.ref); }
        })
      ])
    ]));

    /* warm-up */
    root.appendChild(el('div', { class: 'card' }, [
      el('h3', { text: 'Warm-up' }),
      el('p', { class: 'sub', text: 'A short run through whatever is weakest and due — parsing forms, naming the case, calling the tense.' }),
      el('p', { class: 'small faint', text: D.pool({ decks: prefs.decks, modes: prefs.modes }).length + ' questions in the decks you have chosen' }),
      el('div', { class: 'row', style: 'margin-top:10px' }, [
        el('button', {
          class: 'primary', text: 'Start 15 questions',
          onclick: function () {
            var items = D.pool({ decks: prefs.decks, modes: prefs.modes });
            startSession(items, 'Warm-up', 15);
          }
        }),
        el('button', { text: 'Choose decks', onclick: function () { go('drill'); } })
      ])
    ]));

    if (p.note) {
      root.appendChild(el('div', { class: 'card tight' }, [
        el('h3', { text: 'Worth noticing' }),
        el('p', { class: 'small', text: p.note })
      ]));
    }

    var m = hookOfTheDay();
    if (m) {
      root.appendChild(el('div', { class: 'card' }, [
        el('div', { class: 'spread' }, [
          el('h3', { text: 'Hook of the day' }),
          el('button', { class: 'ghost small', text: 'all hooks ›', onclick: function () { go('learn'); } })
        ]),
        hookCard(m)
      ]));
    }
  }

  // Same hook all day, a different one tomorrow, and it walks the whole list
  // before repeating.
  function hookOfTheDay() {
    if (!GK.mnemonics || !GK.mnemonics.length) return null;
    var days = Math.floor(new Date(U.today() + 'T00:00:00').getTime() / 86400000);
    return GK.mnemonics[((days % GK.mnemonics.length) + GK.mnemonics.length) % GK.mnemonics.length];
  }

  function passageItems(pid) {
    return D.all().filter(function (i) { return i.id.indexOf('rp:' + pid + ':') === 0; });
  }

  /* ---------- drill setup ---------- */

  function renderDrill(root) {
    if (state.session) return renderSession(root);

    root.appendChild(el('h1', { text: 'Drill' }));
    root.appendChild(el('p', { class: 'sub', text: 'Pick what to work on. Questions are chosen by what you have got wrong and what is due for review.' }));

    var deckCard = el('div', { class: 'card' }, [el('h3', { text: 'Decks' })]);
    GK.DECKS.forEach(function (d) {
      var ids = D.pool({ decks: [d.id] }).map(function (i) { return i.id; });
      var st = S.stats(ids);
      var cb = el('input', { type: 'checkbox' });
      cb.checked = prefs.decks.indexOf(d.id) !== -1;
      cb.addEventListener('change', function () {
        prefs.decks = GK.DECKS.filter(function (x) {
          return x.id === d.id ? cb.checked : prefs.decks.indexOf(x.id) !== -1;
        }).map(function (x) { return x.id; });
        savePrefs();
      });
      deckCard.appendChild(el('label', { class: 'check' }, [
        cb,
        el('div', {}, [
          el('div', { class: 't', text: d.name + '  ' }),
          el('div', { class: 'd', text: d.blurb + ' · ' + ids.length + ' items · ' + st.learned + ' learned' })
        ])
      ]));
    });
    root.appendChild(deckCard);

    var modeCard = el('div', { class: 'card' }, [el('h3', { text: 'Question types' })]);
    [
      { id: 'parse', t: 'Parse a form', d: 'You see λύσωμεν — you name the tense, voice, mood, person and number.' },
      { id: 'produce', t: 'Build a form', d: 'You see “1st plural aorist active subjunctive of λύω” — you type it.' },
      { id: 'recall', t: 'Vocabulary recall', d: 'Greek word, you say the meaning, then grade yourself.' }
    ].forEach(function (m) {
      var cb = el('input', { type: 'checkbox' });
      cb.checked = prefs.modes.indexOf(m.id) !== -1;
      cb.addEventListener('change', function () {
        if (cb.checked) { if (prefs.modes.indexOf(m.id) === -1) prefs.modes.push(m.id); }
        else prefs.modes = prefs.modes.filter(function (x) { return x !== m.id; });
        savePrefs();
      });
      modeCard.appendChild(el('label', { class: 'check' }, [
        cb, el('div', {}, [el('div', { class: 't', text: m.t }), el('div', { class: 'd', text: m.d })])
      ]));
    });
    root.appendChild(modeCard);

    var lenRow = el('div', { class: 'row' });
    [10, 20, 40, 0].forEach(function (n) {
      var b = el('button', { text: n === 0 ? 'Everything due' : n + ' questions' });
      if (prefs.length === n) b.className = 'primary';
      b.addEventListener('click', function () { prefs.length = n; savePrefs(); render(); });
      lenRow.appendChild(b);
    });
    root.appendChild(el('div', { class: 'card' }, [el('h3', { text: 'Session length' }), lenRow]));

    var avail = D.pool({ decks: prefs.decks, modes: prefs.modes });
    root.appendChild(el('button', {
      class: 'primary wide', style: 'margin-top:6px',
      text: avail.length ? 'Start drilling' : 'Choose at least one deck and question type',
      disabled: avail.length ? null : 'disabled',
      onclick: function () { startSession(avail, 'Drill', prefs.length || 0); }
    }));
  }

  /* ---------- session ---------- */

  function startSession(items, title, limit) {
    if (!items.length) return;
    limit = limit === undefined ? (prefs.length || 0) : limit;
    var ids = S.order(items.map(function (i) { return i.id; }));
    var order = ids.map(function (id) {
      return items.filter(function (i) { return i.id === id; })[0];
    }).filter(Boolean);
    if (limit > 0) order = order.slice(0, limit);
    state.session = {
      title: title, items: order, i: 0, right: 0, wrong: 0,
      answered: false, correct: false, picked: {}, missed: []
    };
    go('drill');
  }

  function renderSession(root) {
    var s = state.session;
    if (s.i >= s.items.length) return renderSessionEnd(root, s);
    var item = s.items[s.i];

    root.appendChild(el('div', { class: 'spread', style: 'margin-top:16px' }, [
      el('div', {}, [
        el('span', { style: 'font-weight:650', text: s.title }),
        el('span', { class: 'faint small', text: '  ' + (s.i + 1) + ' / ' + s.items.length })
      ]),
      el('button', { class: 'ghost', text: 'End', onclick: function () { s.i = s.items.length; render(); } })
    ]));
    root.appendChild(el('div', { class: 'progressbar' }, [
      el('i', { style: 'width:' + Math.round(100 * s.i / s.items.length) + '%' })
    ]));

    var card = el('div', { class: 'card' });
    root.appendChild(card);

    /* prompt */
    var prompt = el('div', { class: 'prompt' });
    prompt.appendChild(el('div', { class: 'instruction', text: item.question.instruction }));
    if (item.question.form) prompt.appendChild(el('div', { class: 'form gk', text: item.question.form }));
    if (item.mode !== 'parse' && item.question.lemma) {
      prompt.appendChild(el('div', { class: item.deck === 'vocab' ? 'lemma' : 'lemma gk', text: item.question.lemma }));
    }
    if (item.mode !== 'parse' && item.question.gloss) {
      prompt.appendChild(el('div', { class: 'gloss', text: item.question.gloss }));
    }
    if (item.question.source) prompt.appendChild(el('div', { class: 'src' }, [el('span', { class: 'pill', text: item.question.source })]));
    card.appendChild(prompt);

    if (item.mode === 'parse') renderParseInput(card, item, s);
    else if (item.mode === 'produce') renderProduceInput(card, item, s);
    else renderRecallInput(card, item, s);
  }

  function commit(item, correct, s) {
    if (s.answered) return;
    s.answered = true;
    s.correct = correct;
    if (correct) s.right++; else { s.wrong++; s.missed.push(item); }
    S.grade(item.id, correct);
    var d = dayRec(U.today());
    d.answered++;
    if (correct) d.right++;
    saveProgress();
    render();
  }

  function next(s) {
    s.i++; s.answered = false; s.correct = false; s.picked = {};
    render();
  }

  function verdictBlock(item, s, extra) {
    var box = el('div', { class: 'verdict ' + (s.correct ? 'right' : 'wrong') }, [
      el('div', { class: 'head', text: s.correct ? 'Right' : 'Not quite' })
    ]);
    if (extra) box.appendChild(extra);
    box.appendChild(el('div', { class: 'gk', style: 'font-size:19px', text: item.reveal }));
    if (item.question.lemma && item.mode === 'parse') {
      box.appendChild(el('div', { class: 'small', style: 'margin-top:6px' }, [
        el('span', { class: 'faint', text: 'from ' }),
        el('span', { class: 'gk', style: 'font-size:16px', text: item.question.lemma }),
        item.question.gloss ? el('span', { class: 'faint', text: ' — ' + item.question.gloss }) : null
      ]));
    }
    if (item.note) box.appendChild(el('div', { class: 'note', text: item.note }));
    return box;
  }

  // A hook is worth showing when you just got it wrong, or when the item is
  // still new to you. Once it is sticking, stop interrupting.
  function hooksFor(item, wasRight, focus) {
    var r = S.record(item.id);
    if (wasRight && r && r.box > 1) return [];
    return D.mnemonicsFor(item, wasRight ? 1 : 2, focus);
  }

  function hookBlock(item, wasRight, focus) {
    var hooks = hooksFor(item, wasRight, focus);
    if (!hooks.length) return null;
    var wrap = el('div', { class: 'hooks' }, [
      el('div', { class: 'hookslabel', text: hooks.length > 1 ? 'Memory hooks' : 'Memory hook' })
    ]);
    hooks.forEach(function (m) { wrap.appendChild(hookCard(m, !wasRight)); });
    return wrap;
  }

  function nextButton(s, label) {
    var b = el('button', { class: 'primary wide', text: label || 'Next', onclick: function () { next(s); } });
    setTimeout(function () { b.focus(); }, 0);
    return b;
  }

  function renderParseInput(card, item, s) {
    var fields = item.fields;

    function evaluate() {
      if (fields.some(function (f) { return !s.picked[f]; })) return;
      commit(item, D.checkParse(item, s.picked), s);
    }

    fields.forEach(function (f) {
      var def = D.FIELD_DEFS[f];
      var group = el('div', { class: 'fieldgroup' }, [el('label', { text: def.label })]);
      var chips = el('div', { class: 'chips' });
      def.opts.forEach(function (o) {
        var b = el('button', {
          type: 'button', text: def.labels[o] || o,
          'aria-pressed': s.picked[f] === o ? 'true' : 'false'
        });
        b.addEventListener('click', function () {
          if (s.answered) return;
          s.picked[f] = o;
          Array.prototype.forEach.call(chips.children, function (c) {
            c.setAttribute('aria-pressed', c === b ? 'true' : 'false');
          });
          evaluate();
        });
        chips.appendChild(b);
      });
      group.appendChild(chips);
      card.appendChild(group);
    });

    if (!s.answered) {
      card.appendChild(el('button', {
        class: 'ghost', text: 'Show the lexical form',
        onclick: function (e) {
          e.target.replaceWith(el('div', { class: 'small faint' }, [
            el('span', { class: 'gk', style: 'font-size:17px', text: item.question.lemma || '—' }),
            el('span', { text: item.question.gloss ? '  ' + item.question.gloss : '' })
          ]));
        }
      }));
    } else {
      card.appendChild(verdictBlock(item, s, s.correct ? null :
        el('div', { class: 'small', style: 'margin-bottom:6px' , text: 'You said: ' + D.describe(s.picked, item.fields) })));
      var hb = hookBlock(item, s.correct, s.correct ? [] : D.wrongFields(item, s.picked));
      if (hb) card.appendChild(hb);
      card.appendChild(nextButton(s));
    }
  }

  function renderProduceInput(card, item, s) {
    if (s.answered) {
      card.appendChild(verdictBlock(item, s,
        s.correct ? null : el('div', { class: 'small', style: 'margin-bottom:6px', text: 'You typed: ' + (s.typed || '—') })));
      var hb = hookBlock(item, s.correct);
      if (hb) card.appendChild(hb);
      card.appendChild(nextButton(s));
      return;
    }

    var input = el('input', { type: 'text', class: 'answer gk', autocomplete: 'off',
      autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false',
      placeholder: item.deck === 'vocab' ? 'Greek word' : 'type the form' });
    var preview = el('div', { class: 'small faint', style: 'text-align:center;min-height:22px;margin-top:6px' });

    function submit() {
      s.typed = input.value;
      commit(item, D.checkTyped(item, input.value), s);
    }

    input.addEventListener('input', function () {
      var v = input.value;
      preview.textContent = /[A-Za-z]/.test(v) ? '→ ' + U.translit(v) : '';
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });

    card.appendChild(input);
    card.appendChild(preview);
    card.appendChild(el('p', { class: 'small faint', style: 'text-align:center',
      text: 'Accents are ignored. You can type Latin letters — “luomen” counts as λύομεν.' }));
    card.appendChild(greekKeypad(input));
    card.appendChild(el('button', { class: 'primary wide', style: 'margin-top:12px', text: 'Check', onclick: submit }));
    setTimeout(function () { input.focus(); }, 0);
  }

  function greekKeypad(input) {
    var pad = el('div', { class: 'keypad' });
    'αβγδεζηθικλμνξοπρστυφχψω'.split('').forEach(function (ch) {
      pad.appendChild(el('button', {
        type: 'button', class: 'gk', text: ch,
        onclick: function () { input.value += ch; input.focus(); input.dispatchEvent(new Event('input')); }
      }));
    });
    pad.appendChild(el('button', { type: 'button', class: 'gk', text: 'ς',
      onclick: function () { input.value += 'ς'; input.focus(); } }));
    pad.appendChild(el('button', { type: 'button', class: 'wide2', text: '⌫ delete',
      onclick: function () { input.value = input.value.slice(0, -1); input.focus(); input.dispatchEvent(new Event('input')); } }));
    return pad;
  }

  function renderRecallInput(card, item, s) {
    if (!s.answered && !s.shown) {
      card.appendChild(el('button', {
        class: 'primary wide', text: 'Show the meaning',
        onclick: function () { s.shown = true; render(); }
      }));
      if (item.meta) card.appendChild(el('p', { class: 'small faint', style: 'text-align:center', text: item.meta }));
      return;
    }
    if (!s.answered) {
      card.appendChild(el('div', { class: 'card tight', style: 'text-align:center;font-size:18px' }, [
        el('div', { text: item.reveal })
      ]));
      card.appendChild(el('div', { class: 'row', style: 'margin-top:10px' }, [
        el('button', { class: 'primary', style: 'flex:1', text: 'I knew it',
          onclick: function () { s.shown = false; commit(item, true, s); } }),
        el('button', { style: 'flex:1', text: 'Missed it',
          onclick: function () { s.shown = false; commit(item, false, s); } })
      ]));
      return;
    }
    card.appendChild(verdictBlock(item, s));
    card.appendChild(nextButton(s));
  }

  function renderSessionEnd(root, s) {
    var total = s.right + s.wrong;
    root.appendChild(el('h1', { text: total ? 'Session done' : 'Nothing answered' }));
    root.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'streak' }, [
        el('div', { class: 'stat' }, [el('b', { text: String(s.right) }), el('span', { text: 'right' })]),
        el('div', { class: 'stat' }, [el('b', { text: String(s.wrong) }), el('span', { text: 'missed' })]),
        el('div', { class: 'stat' }, [
          el('b', { text: total ? Math.round(100 * s.right / total) + '%' : '—' }),
          el('span', { text: 'accuracy' })
        ])
      ])
    ]));

    if (s.missed.length) {
      var list = el('div', { class: 'card' }, [el('h3', { text: 'Worth another look' })]);
      s.missed.slice(0, 15).forEach(function (it) {
        list.appendChild(el('div', { style: 'padding:6px 0;border-bottom:1px solid var(--line)' }, [
          el('div', { class: 'gk', style: 'font-size:20px', text: it.question.form || it.question.lemma || '' }),
          el('div', { class: 'small faint', text: it.reveal })
        ]));
      });
      root.appendChild(list);
    }

    root.appendChild(el('div', { class: 'row' }, [
      s.missed.length ? el('button', {
        class: 'primary', text: 'Redo the missed ones',
        onclick: function () { startSession(s.missed.slice(), 'Second pass', 0); }
      }) : null,
      el('button', { text: 'Back to today', onclick: function () { go('today'); } }),
      el('button', { text: 'New session', onclick: function () { state.session = null; render(); } })
    ]));
  }

  /* ---------- reading ---------- */

  function renderRead(root) {
    if (!state.passageId) return renderPassageList(root);
    var p = GK.passages.filter(function (x) { return x.id === state.passageId; })[0];
    if (!p) { state.passageId = null; return renderPassageList(root); }

    root.appendChild(el('button', { class: 'ghost', style: 'margin-top:12px', text: '‹ All passages',
      onclick: function () { state.passageId = null; state.wordIndex = null; render(); } }));
    root.appendChild(el('h1', { text: p.ref }));
    root.appendChild(el('p', { class: 'sub', text: p.title }));

    var modes = el('div', { class: 'row', style: 'margin:12px 0' });
    [['plain', 'Greek only'], ['inter', 'With glosses'], ['en', 'With English']].forEach(function (m) {
      var b = el('button', { text: m[1] });
      if (state.readMode === m[0]) b.className = 'primary';
      b.addEventListener('click', function () { state.readMode = m[0]; render(); });
      modes.appendChild(b);
    });
    root.appendChild(modes);

    var card = el('div', { class: 'card' });
    var passage = el('div', { class: 'passage gk' + (state.readMode === 'inter' ? ' interlinear' : '') });
    p.words.forEach(function (w, i) {
      var node = el('span', { class: 'w' + (state.wordIndex === i ? ' on' : ''), tabindex: '0' }, [
        document.createTextNode(w[0])
      ]);
      if (state.readMode === 'inter') {
        node.appendChild(el('em', { text: w[1] }));
        node.appendChild(el('em', { class: 'p', text: w[2] }));
      }
      function open() { state.wordIndex = state.wordIndex === i ? null : i; render(); }
      node.addEventListener('click', open);
      node.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      passage.appendChild(node);
      passage.appendChild(document.createTextNode(' '));
    });
    card.appendChild(passage);

    if (state.wordIndex !== null && p.words[state.wordIndex]) {
      var w = p.words[state.wordIndex];
      card.appendChild(el('div', { class: 'worddetail' }, [
        el('div', { class: 'g gk', text: w[0].replace(/[.,;·:!?]+$/, '') }),
        el('div', { style: 'font-weight:600', text: w[1] }),
        el('div', { class: 'small', style: 'color:var(--accent)', text: w[2] }),
        el('div', { class: 'small faint' }, [
          el('span', { text: 'lexical form: ' }),
          el('span', { class: 'gk', style: 'font-size:16px', text: w[3] })
        ])
      ]));
    } else {
      card.appendChild(el('p', { class: 'small faint', text: 'Tap any word for its meaning and parsing.' }));
    }
    root.appendChild(card);

    if (state.readMode === 'en') {
      root.appendChild(el('div', { class: 'card tight' }, [
        el('h3', { text: 'Wooden English' }),
        el('p', { text: p.en })
      ]));
    }

    if (p.note) {
      root.appendChild(el('div', { class: 'card tight' }, [
        el('h3', { text: 'Worth noticing' }),
        el('p', { class: 'small', text: p.note })
      ]));
    }

    var t = U.today();
    var already = progress.days[t] && progress.days[t].read.indexOf(p.id) !== -1;
    root.appendChild(el('div', { class: 'row' }, [
      el('button', {
        class: already ? '' : 'primary',
        text: already ? 'Marked as read ✓' : 'Mark as read',
        disabled: already ? 'disabled' : null,
        onclick: function () {
          var d = dayRec(t);
          if (d.read.indexOf(p.id) === -1) d.read.push(p.id);
          if (progress.todayPassage && progress.todayPassage.id === p.id) progress.readingIndex++;
          saveProgress();
          render();
        }
      }),
      el('button', {
        text: 'Drill these words',
        onclick: function () { startSession(passageItems(p.id), 'Words from ' + p.ref, 0); }
      })
    ]));

    var idx = GK.passages.indexOf(p);
    root.appendChild(el('div', { class: 'row', style: 'margin-top:16px' }, [
      idx > 0 ? el('button', { class: 'ghost', text: '‹ ' + GK.passages[idx - 1].ref,
        onclick: function () { state.passageId = GK.passages[idx - 1].id; state.wordIndex = null; render(); window.scrollTo(0, 0); } }) : null,
      idx < GK.passages.length - 1 ? el('button', { class: 'ghost', style: 'margin-left:auto', text: GK.passages[idx + 1].ref + ' ›',
        onclick: function () { state.passageId = GK.passages[idx + 1].id; state.wordIndex = null; render(); window.scrollTo(0, 0); } }) : null
    ]));
  }

  function renderPassageList(root) {
    root.appendChild(el('h1', { text: 'Read' }));
    root.appendChild(el('p', { class: 'sub', text: GK.passages.length + ' passages, every word parsed. Start with level 1 and work up.' }));

    var readIds = {};
    Object.keys(progress.days).forEach(function (d) {
      (progress.days[d].read || []).forEach(function (id) { readIds[id] = true; });
    });

    [1, 2, 3].forEach(function (lvl) {
      var group = GK.passages.filter(function (p) { return p.level === lvl; });
      if (!group.length) return;
      root.appendChild(el('h2', { text: ['Level 1 — short and plain', 'Level 2 — longer sentences', 'Level 3 — participles and subordination'][lvl - 1] }));
      var list = el('div', { class: 'passagelist' });
      group.forEach(function (p) {
        list.appendChild(el('button', {
          onclick: function () { state.passageId = p.id; state.wordIndex = null; render(); window.scrollTo(0, 0); }
        }, [
          readIds[p.id] ? el('span', { class: 'dot' }) : el('span', { style: 'width:7px;flex:0 0 auto' }),
          el('span', { class: 'ref', text: p.ref }),
          el('span', { class: 'ti', text: p.title })
        ]));
      });
      root.appendChild(list);
    });
  }

  /* ---------- charts ---------- */

  function table(rows, opts) {
    opts = opts || {};
    var t = el('table');
    var head = el('thead'), body = el('tbody');
    rows.forEach(function (r, i) {
      var tr = el('tr');
      r.forEach(function (cell, ci) {
        var isHead = i === 0 || ci === 0;
        var node = el(isHead ? 'th' : 'td', { text: cell === null ? '—' : String(cell) });
        if (!isHead && opts.greek) node.className = 'gk';
        if (i === 0) node.setAttribute('scope', 'col');
        tr.appendChild(node);
      });
      (i === 0 ? head : body).appendChild(tr);
    });
    t.appendChild(head); t.appendChild(body);
    if (opts.caption) t.appendChild(el('caption', { text: opts.caption }));
    return el('div', { class: 'tablewrap' }, [t]);
  }

  function nominalTable(entry) {
    var genders = Object.keys(entry.forms);
    var head = [''].concat(genders.map(function (g) {
      return entry.genderless ? 'form' : GK.GENDER_LABEL[g];
    }));
    var rows = [head];
    ['sg', 'pl'].forEach(function (n) {
      GK.CASES.forEach(function (c, ci) {
        var cells = genders.map(function (g) {
          return (entry.forms[g][n] || [])[ci] || null;
        });
        if (cells.every(function (x) { return !x; })) return;
        rows.push([GK.CASE_LABEL[c] + ' ' + n].concat(cells));
      });
    });
    return table(rows, { greek: true, caption: entry.note });
  }

  function verbTable(verb) {
    var wrap = el('div');
    var groups = {};
    verb.paradigms.forEach(function (p) {
      var k = p.mood;
      (groups[k] = groups[k] || []).push(p);
    });
    Object.keys(groups).forEach(function (mood) {
      wrap.appendChild(el('h3', { style: 'margin-top:14px', text: mood }));
      var pars = groups[mood];
      var slots = mood === 'imperative' ? ['2s', '3s', '2p', '3p'] : ['1s', '2s', '3s', '1p', '2p', '3p'];
      var head = [''].concat(pars.map(function (p) {
        return GK.TENSE_LABEL[p.tense] + ' ' + GK.VOICE_LABEL[p.voice];
      }));
      var rows = [head];
      slots.forEach(function (sl) {
        var label = { '1s': '1 sg', '2s': '2 sg', '3s': '3 sg', '1p': '1 pl', '2p': '2 pl', '3p': '3 pl' }[sl];
        rows.push([label].concat(pars.map(function (p) { return p.forms[sl] || null; })));
      });
      wrap.appendChild(table(rows, { greek: true }));
    });

    if (verb.infinitives && verb.infinitives.length) {
      wrap.appendChild(el('h3', { style: 'margin-top:14px', text: 'infinitives' }));
      wrap.appendChild(table([['', 'form']].concat(verb.infinitives.map(function (i) {
        return [GK.TENSE_LABEL[i.tense] + ' ' + GK.VOICE_LABEL[i.voice], i.form];
      })), { greek: true }));
    }
    if (verb.participles && verb.participles.length) {
      wrap.appendChild(el('h3', { style: 'margin-top:14px', text: 'participles' }));
      wrap.appendChild(table([['', 'masc', 'fem', 'neut', 'genitive']].concat(verb.participles.map(function (p) {
        return [GK.TENSE_LABEL[p.tense] + ' ' + GK.VOICE_LABEL[p.voice], p.forms[0], p.forms[1], p.forms[2], p.gen];
      })), { greek: true }));
    }
    return wrap;
  }

  function hookCard(m, open) {
    var body = el('div', { class: 'body' }, [el('p', { class: 'small', text: m.why })]);
    if (m.examples) {
      var ul = el('ul', { class: 'egs gk' });
      m.examples.forEach(function (e) { ul.appendChild(el('li', { text: e })); });
      body.appendChild(ul);
    }
    var det = el('details', { class: 'plain' }, [
      el('summary', { text: 'Why, and examples' }), body
    ]);
    if (open) det.setAttribute('open', 'open');
    return el('div', { class: 'hookcard' }, [
      el('div', { class: 'hooktitle', text: m.title }),
      el('p', { class: 'hookline', text: m.hook }),
      m.ask ? el('p', { class: 'small faint', text: m.ask }) : null,
      det
    ]);
  }

  function renderLearn(root) {
    root.appendChild(el('h1', { text: 'Learn' }));
    root.appendChild(el('p', { class: 'sub', text: 'Memory hooks first, then every paradigm the drills draw from. The hooks also come back at you in the Drill tab whenever you miss something they cover.' }));

    root.appendChild(el('h2', { text: 'Memory hooks' }));
    GK.mnemonicSections.forEach(function (sec) {
      var group = GK.mnemonics.filter(function (m) { return m.section === sec.id; });
      if (!group.length) return;
      root.appendChild(el('div', { class: 'seclead' }, [
        el('h3', { text: sec.name }),
        el('p', { class: 'small faint', text: sec.blurb })
      ]));
      group.forEach(function (m) { root.appendChild(hookCard(m)); });
    });

    root.appendChild(el('h2', { text: 'Charts' }));
    root.appendChild(el('p', { class: 'sub', text: 'Open one, stare at it, then go break it in the Drill tab.' }));

    root.appendChild(el('h2', { text: 'Endings worth memorising' }));
    GK.endingCharts.forEach(function (c) {
      root.appendChild(el('details', {}, [
        el('summary', { text: c.name }),
        el('div', { class: 'body' }, [table(c.rows, { greek: true, caption: c.chapter })])
      ]));
    });
    GK.verbCharts.forEach(function (c) {
      root.appendChild(el('details', {}, [
        el('summary', { text: c.name }),
        el('div', { class: 'body' }, [table(c.rows, { caption: c.caption })])
      ]));
    });

    root.appendChild(el('h2', { text: 'Article, nouns, adjectives, pronouns' }));
    GK.nominals.forEach(function (n) {
      root.appendChild(el('details', {}, [
        el('summary', {}, [
          el('span', { class: 'gk', text: n.lemma }),
          el('span', { class: 'faint small', text: '  ' + n.gloss })
        ]),
        el('div', { class: 'body' }, [
          el('p', { class: 'small faint', text: n.name + ' · ' + n.chapter }),
          nominalTable(n),
          el('button', {
            class: 'ghost', text: 'Drill this paradigm',
            onclick: function () {
              startSession(D.all().filter(function (i) {
                return i.id.indexOf('np:' + n.id + ':') === 0 || i.id.indexOf('nq:' + n.id + ':') === 0;
              }), n.lemma, 0);
            }
          })
        ])
      ]));
    });

    root.appendChild(el('h2', { text: 'Verbs' }));
    GK.verbs.forEach(function (v) {
      root.appendChild(el('details', {}, [
        el('summary', {}, [
          el('span', { class: 'gk', text: v.lemma }),
          el('span', { class: 'faint small', text: '  ' + v.gloss })
        ]),
        el('div', { class: 'body' }, [
          el('p', { class: 'small faint', text: v.klass + ' · ' + v.chapter }),
          el('p', { class: 'gk', style: 'font-size:18px', text: v.principalParts.join('  ·  ') }),
          v.note ? el('p', { class: 'small faint', text: v.note }) : null,
          verbTable(v),
          el('button', {
            class: 'ghost', style: 'margin-top:10px', text: 'Drill this verb',
            onclick: function () {
              startSession(D.all().filter(function (i) {
                return i.id.indexOf('vp:' + v.id + ':') === 0 || i.id.indexOf('vq:' + v.id + ':') === 0;
              }), v.lemma, 0);
            }
          })
        ])
      ]));
    });

    root.appendChild(el('h2', { text: 'Principal parts' }));
    root.appendChild(el('div', { class: 'card' }, [
      table([['', 'present', 'future', 'aorist', 'perfect act', 'perfect m/p', 'aorist pass']]
        .concat(GK.principalParts.map(function (p) { return [p.lemma].concat(p.parts); })), { greek: true })
    ]));
  }

  /* ---------- progress ---------- */

  function renderProgress(root) {
    root.appendChild(el('h1', { text: 'Progress' }));

    var allIds = D.all().map(function (i) { return i.id; });
    var st = S.stats(allIds);
    root.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'streak' }, [
        el('div', { class: 'stat' }, [el('b', { text: String(streak()) }), el('span', { text: 'day streak' })]),
        el('div', { class: 'stat' }, [el('b', { text: String(st.seen) }), el('span', { text: 'items seen' })]),
        el('div', { class: 'stat' }, [el('b', { text: String(st.learned) }), el('span', { text: 'learned' })]),
        el('div', { class: 'stat' }, [
          el('b', { text: (st.right + st.wrong) ? Math.round(100 * st.right / (st.right + st.wrong)) + '%' : '—' }),
          el('span', { text: 'lifetime' })
        ])
      ])
    ]));

    var deckCard = el('div', { class: 'card' }, [el('h3', { text: 'By deck' })]);
    GK.DECKS.forEach(function (d) {
      var ids = D.pool({ decks: [d.id] }).map(function (i) { return i.id; });
      var s = S.stats(ids);
      deckCard.appendChild(el('div', { style: 'margin:12px 0' }, [
        el('div', { class: 'spread' }, [
          el('span', { style: 'font-weight:600', text: d.name }),
          el('span', { class: 'small faint', text: s.learned + ' learned · ' + s.seen + ' seen · ' + ids.length + ' total' })
        ]),
        el('div', { class: 'bar', style: 'margin-top:5px' }, [
          el('i', { class: 'learned', style: 'width:' + (100 * s.learned / Math.max(1, ids.length)) + '%' }),
          el('i', { class: 'seen', style: 'width:' + (100 * Math.max(0, s.seen - s.learned) / Math.max(1, ids.length)) + '%' })
        ])
      ]));
    });
    root.appendChild(deckCard);

    var days = Object.keys(progress.days).sort().slice(-14);
    if (days.length) {
      var hist = el('div', { class: 'card' }, [el('h3', { text: 'Last two weeks' })]);
      days.forEach(function (d) {
        var r = progress.days[d];
        hist.appendChild(el('div', { class: 'spread', style: 'padding:3px 0' }, [
          el('span', { class: 'small', text: d }),
          el('span', { class: 'small faint', text: r.answered + ' answered · ' + r.read.length + ' read' })
        ]));
      });
      root.appendChild(hist);
    }

    var themeRow = el('div', { class: 'row' });
    [['auto', 'Match system'], ['light', 'Light'], ['dark', 'Dark']].forEach(function (t) {
      var b = el('button', { text: t[1] });
      if (prefs.theme === t[0]) b.className = 'primary';
      b.addEventListener('click', function () { prefs.theme = t[0]; savePrefs(); applyTheme(); render(); });
      themeRow.appendChild(b);
    });
    root.appendChild(el('div', { class: 'card' }, [el('h3', { text: 'Appearance' }), themeRow]));

    root.appendChild(el('div', { class: 'card' }, [
      el('h3', { text: 'Start over' }),
      el('p', { class: 'small faint', text: 'Everything is stored in this browser only. Nothing is uploaded anywhere.' }),
      el('div', { class: 'row', style: 'margin-top:8px' }, [
        el('button', {
          text: 'Reset review schedule',
          onclick: function () {
            if (window.confirm('Forget every item’s review schedule? Your reading history stays.')) { S.reset(); render(); }
          }
        }),
        el('button', {
          text: 'Reset everything',
          onclick: function () {
            if (window.confirm('Erase all progress, streak and reading history?')) {
              U.clearAll();
              progress = { days: {}, readingIndex: 0, todayPassage: null };
              prefs = { decks: ['article', 'nouns', 'adjectives', 'pronouns', 'verbs', 'principalparts', 'reading'], modes: ['parse'], length: 20, theme: 'auto' };
              S.reset(); go('today');
            }
          }
        })
      ])
    ]));
  }

  /* ---------- boot ---------- */

  // The in-app toggle writes data-app-theme, never data-theme: a host page may
  // own data-theme, and "match system" has to hand control straight back to it.
  function applyTheme() {
    var root = document.documentElement;
    if (prefs.theme === 'auto') root.removeAttribute('data-app-theme');
    else root.setAttribute('data-app-theme', prefs.theme);
  }

  function init() {
    viewEl = document.getElementById('view');
    tabsEl = document.getElementById('tabs');
    VIEWS.forEach(function (v) {
      var b = el('button', { type: 'button', 'aria-selected': 'false' }, [
        el('span', { class: 'ic', text: v.ic }),
        el('span', { text: v.label })
      ]);
      b.dataset.view = v.id;
      b.addEventListener('click', function () { go(v.id); });
      tabsEl.appendChild(b);
    });
    applyTheme();
    render();
  }

  return { init: init, go: go };
})();

document.addEventListener('DOMContentLoaded', GK.app.init);
