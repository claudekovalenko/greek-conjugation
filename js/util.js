/* util.js — Greek text helpers, storage, small utilities.
   Everything hangs off the global GK namespace so the app runs from file://
   with no build step and no module/CORS problems. */
var GK = window.GK || {};
window.GK = GK;

GK.util = (function () {
  'use strict';

  /* ---------- Greek text ---------- */

  // Strip accents, breathings, iota subscript, diaeresis. Keeps letters only.
  function bare(s) {
    return String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .normalize('NFC')
      .toLowerCase()
      .replace(/ς/g, 'σ'); // final sigma -> sigma
  }

  // Loose comparison key: bare letters, no punctuation, no movable-nu parens.
  function key(s) {
    return bare(s)
      .replace(/\(ν\)/g, '')
      .replace(/[^\u0370-\u03ff\u1f00-\u1fff]/g, '');
  }

  // Beta-code-ish transliteration so you can type Greek on a Latin keyboard.
  var TRANSLIT = {
    a: 'α', b: 'β', g: 'γ', d: 'δ', e: 'ε', z: 'ζ', h: 'η', q: 'θ', i: 'ι',
    k: 'κ', l: 'λ', m: 'μ', n: 'ν', c: 'ξ', o: 'ο', p: 'π', r: 'ρ', s: 'σ',
    t: 'τ', u: 'υ', f: 'φ', x: 'χ', y: 'ψ', w: 'ω', v: 'ϝ'
  };

  // Convert any Latin letters in the string to Greek; leaves Greek untouched.
  function translit(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      var lower = c.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(TRANSLIT, lower)) {
        // "th" digraph is nicer than q for most people; handle it inline.
        if (lower === 't' && (s[i + 1] || '').toLowerCase() === 'h') {
          out += 'θ'; i++; continue;
        }
        if (lower === 'p' && (s[i + 1] || '').toLowerCase() === 'h') {
          out += 'φ'; i++; continue;
        }
        if (lower === 'c' && (s[i + 1] || '').toLowerCase() === 'h') {
          out += 'χ'; i++; continue;
        }
        if (lower === 'p' && (s[i + 1] || '').toLowerCase() === 's') {
          out += 'ψ'; i++; continue;
        }
        out += TRANSLIT[lower];
      } else {
        out += c;
      }
    }
    // Final sigma at word end reads better.
    return out.replace(/σ(?=$|[\s.,;·:!?])/g, 'ς');
  }

  // Does the learner's typed answer match any accepted spelling?
  // Accent-insensitive by design: Mounce doesn't drill accents, and typing
  // them on a phone is punishment, not practice.
  function answerMatches(typed, accepted) {
    var t = key(translit(typed || ''));
    if (!t) return false;
    for (var i = 0; i < accepted.length; i++) {
      var a = key(accepted[i]);
      if (t === a) return true;
      // movable nu: λύουσι / λύουσιν both fine
      if (t.replace(/ν$/, '') === a.replace(/ν$/, '')) return true;
    }
    return false;
  }

  // Letters in parentheses are optional: movable nu, an optional augment.
  // "λύουσι(ν)" -> ["λύουσι", "λύουσιν"];  "(ἐ)λελύκειν" -> both spellings.
  function variants(form) {
    var without = form.replace(/\([^)]*\)/g, '');
    var with_ = form.replace(/[()]/g, '');
    return without === with_ ? [without] : [without, with_];
  }

  /* ---------- collections ---------- */

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------- storage ---------- */

  var PREFIX = 'greekdrill:';

  function load(name, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + name);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function save(name, value) {
    try {
      localStorage.setItem(PREFIX + name, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearAll() {
    try {
      var doomed = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) doomed.push(k);
      }
      doomed.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) { /* nothing we can do */ }
  }

  /* ---------- dates ---------- */

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function daysBetween(isoA, isoB) {
    var a = new Date(isoA + 'T00:00:00');
    var b = new Date(isoB + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }

  /* ---------- dom ---------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  return {
    bare: bare, key: key, translit: translit, answerMatches: answerMatches,
    variants: variants,
    shuffle: shuffle, pick: pick,
    load: load, save: save, clearAll: clearAll,
    today: today, daysBetween: daysBetween,
    el: el
  };
})();
