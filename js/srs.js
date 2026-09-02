/* srs.js — Leitner-box scheduling. Items you miss come back tomorrow;
   items you know drift out to a month. Nothing here talks to the DOM. */
var GK = window.GK || {}; window.GK = GK;

GK.srs = (function () {
  'use strict';

  var INTERVALS = [0, 1, 2, 4, 8, 16, 32]; // days per box
  var state = null;

  function ensure() {
    if (!state) state = GK.util.load('srs', { items: {} });
    if (!state.items) state.items = {};
    return state;
  }

  function persist() { GK.util.save('srs', ensure()); }

  function rec(id) {
    var s = ensure();
    if (!s.items[id]) {
      s.items[id] = { box: 0, due: null, seen: 0, right: 0, wrong: 0 };
    }
    return s.items[id];
  }

  function addDays(iso, n) {
    var d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function grade(id, correct) {
    var r = rec(id);
    var today = GK.util.today();
    r.seen++;
    if (correct) {
      r.right++;
      r.box = Math.min(r.box + 1, INTERVALS.length - 1);
    } else {
      r.wrong++;
      r.box = 0;
    }
    r.due = addDays(today, INTERVALS[r.box]);
    persist();
    return r;
  }

  // Lower score = more urgent. Never-seen items sort just behind overdue ones.
  function urgency(id) {
    var s = ensure();
    var r = s.items[id];
    if (!r || r.seen === 0) return 1;          // fresh material
    var overdue = r.due ? GK.util.daysBetween(r.due, GK.util.today()) : 99;
    if (overdue < 0) return 100 + r.box;       // not due yet
    return -overdue + r.box;                   // most overdue, weakest first
  }

  function isDue(id) {
    var s = ensure();
    var r = s.items[id];
    if (!r || r.seen === 0) return true;
    if (!r.due) return true;
    return GK.util.daysBetween(r.due, GK.util.today()) >= 0;
  }

  // Order a pool for study: urgent first, with a little jitter so the same
  // handful of items don't appear in the same order every session.
  function order(ids) {
    return ids.slice().sort(function (a, b) {
      return (urgency(a) + Math.random() * 0.9) - (urgency(b) + Math.random() * 0.9);
    });
  }

  function stats(ids) {
    var s = ensure();
    var out = { total: ids.length, seen: 0, due: 0, learned: 0, right: 0, wrong: 0 };
    ids.forEach(function (id) {
      var r = s.items[id];
      if (!r || !r.seen) { out.due++; return; }
      out.seen++;
      out.right += r.right;
      out.wrong += r.wrong;
      if (r.box >= 4) out.learned++;
      if (isDue(id)) out.due++;
    });
    return out;
  }

  function record(id) { return ensure().items[id] || null; }

  function reset() { state = { items: {} }; persist(); }

  return {
    grade: grade, order: order, isDue: isDue, urgency: urgency,
    stats: stats, record: record, reset: reset, INTERVALS: INTERVALS
  };
})();
