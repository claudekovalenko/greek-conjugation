# Κοινή drill

A parsing trainer and daily reader for New Testament Greek, built for someone
who has finished the basics — Mounce's *Basics of Biblical Greek* or similar —
and can no longer reliably say whether a form is genitive or dative, or whether
a verb is aorist or imperfect.

It is one static page. No build step, no server, no account, no network calls.
Open `index.html` and it runs. Everything you do is stored in your own browser's
`localStorage` and goes nowhere else.

## The two halves

**Drill** — you are shown a form and you name it.

- `ἀγαθήν` → accusative · singular · feminine
- `ἐλύθησαν` → aorist · passive · indicative · 3rd · plural
- or the other direction: "1st plural aorist active subjunctive of λύω" → you type `λύσωμεν`

Ambiguous forms are treated as ambiguous. `τῶν` is one question with three
correct answers, not three questions you can only get a third right. `λύσω` is
accepted as either future active indicative 1st singular or aorist active
subjunctive 1st singular, and after you answer it shows you both.

**Read** — one passage a day, every word parsed. Tap any word for its gloss,
its parsing and its lexical form. Three view modes: bare Greek, interlinear with
glosses under each word, or with a deliberately wooden English rendering that
shows the Greek rather than reading well. Any passage can be turned into a drill
session made only of its own words, which is the point: the parsing you practise
is the parsing you just met in a real sentence.

## What is in it

| | |
|---|---|
| Nominal paradigms | article, 1st/2nd/3rd declension nouns, `ἀγαθός`, `πᾶς`, `αὐτός`, `οὗτος`, `ἐκεῖνος`, `ὅς`, `ἐγώ`, `σύ`, `τίς` |
| Verbs | `λύω` in full — six tenses, indicative/subjunctive/imperative, infinitives, participles — plus `εἰμί`, all three contract types, second aorists, deponents, and `δίδωμι` |
| Principal parts | 28 verbs × six parts |
| Vocabulary | 146 of the most frequent words in the Greek NT |
| Reading | 30 passages, 592 individually parsed words |
| Reference charts | case endings, primary/secondary endings, the master chart of tense formatives, participle morphemes |

That comes to just under 2,000 drillable questions.

## Typing Greek

You do not need a Greek keyboard. Type Latin letters and they are read as Greek
— `luomen` counts as `λύομεν`, `hmera` as `ἡμέρα`. A preview under the box shows
what you are typing. There is also an on-screen Greek keypad.

Accents and breathing marks are ignored when checking answers, and movable nu is
optional: `λύουσι` and `λύουσιν` are both accepted.

## Review scheduling

Leitner boxes. Get an item right and it comes back in 1, 2, 4, 8, 16 then 32
days; get it wrong and it drops back to the front of the queue. Sessions pull the
most overdue and weakest items first. "Learned" means an item has survived four
consecutive correct answers.

## Running it

```
open index.html
```

Or serve the folder if you prefer (`npx http-server`), or push it to GitHub
Pages — it is a static site with no dependencies.

There is also a single-file build, `dist/koine-drill.html`, that contains the
whole app — markup, styles, data and code — in one 157 KB file. Download that
one file and open it: it works offline, with no server and nothing else
alongside it. Regenerate it with `node build.js` after changing anything.

## Notes on the text

The Greek follows public-domain critical editions of the Greek New Testament and
the Septuagint. English renderings, glosses, parsings and grammatical notes are
written for this app and are intentionally literal — they exist to expose the
Greek, not to read as English. Vocabulary frequencies are approximate and are
there to order your effort, not to be quoted.

Chapter references (`BBG 16` and so on) point at Mounce's *Basics of Biblical
Greek* so you can go back to the discussion of anything the drill exposes as
weak. No text from that book is reproduced here.

## Structure

```
index.html            markup and script order
styles.css            one stylesheet, light and dark
js/util.js            Greek normalisation, transliteration, storage
js/data-nominals.js   article, noun, adjective, pronoun paradigms
js/data-verbs.js      verb paradigms, principal parts, reference charts
js/data-vocab.js      vocabulary
js/data-reading.js    passages, parsed word by word
js/srs.js             Leitner scheduling
js/drills.js          turns the data into questions, checks answers
js/app.js             views and DOM wiring
```

Adding a passage means appending one object to `GK.passages` with each word as
`[surface, gloss, parse, lexical form]`; the drill questions for it are generated
automatically. Parse strings use the abbreviations you already know — `gen sg
fem`, `aor act ind 3sg`, `pres act ptc nom sg masc`.
