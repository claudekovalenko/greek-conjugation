/* data-mnemonics.js — memory hooks.
   `tags` decides when a hook surfaces during a drill: a hook matches an answer
   only when every one of its tags is present, so the more tags a hook carries
   the more specific it is and the higher it sorts. */
var GK = window.GK || {}; window.GK = GK;

GK.mnemonicSections = [
  { id: 'cases', name: 'The five cases', blurb: 'What each case is for, and the question that finds it.' },
  { id: 'endings', name: 'Endings that give it away', blurb: 'A handful of endings are unambiguous. Learn these and half the guessing stops.' },
  { id: 'verbs', name: 'Reading a verb', blurb: 'Tense is spelled out in the letters. Learn which letter means what.' },
  { id: 'participles', name: 'Participles', blurb: 'Three bites: tense marker, participle morpheme, case ending.' },
  { id: 'reading', name: 'Habits while reading', blurb: 'What to look at first when a sentence stops making sense.' }
];

GK.mnemonics = [
  /* ---------- the cases ---------- */
  {
    id: 'nom', section: 'cases', prio: 0, tags: ['case:nom'],
    title: 'Nominative',
    hook: 'NOMinative NAMES the subject.',
    why: 'Who or what is doing the verb. It is also the case of the predicate after εἰμί — which is why John 1:1 ends θεὸς ἦν ὁ λόγος with two nominatives and no object anywhere.',
    ask: 'Ask: who or what did it?'
  },
  {
    id: 'gen', section: 'cases', prio: 0, tags: ['case:gen'],
    title: 'Genitive',
    hook: 'Genitive GENerates — it is the “of” case.',
    why: 'Possession, description, source, separation. If you can slide the word “of” in front of the English and it still makes sense, you are probably looking at a genitive.',
    ask: 'Try saying “of ___”. If it works, it is genitive.',
    examples: ['υἱὸς θεοῦ — son of God', 'τῆς δόξης — of the glory']
  },
  {
    id: 'dat', section: 'cases', prio: 0, tags: ['case:dat'],
    title: 'Dative',
    hook: 'Dative DELIVERS — to or for someone.',
    why: 'The indirect object, and also location, means and instrument. English has to reach for one of five little words: to, for, in, with, by.',
    ask: 'Try “to / for / in / with / by ___”.',
    examples: ['λέγει αὐτῷ — he says to him', 'ἐν ἀρχῇ — in the beginning', 'τῇ χάριτι — by grace']
  },
  {
    id: 'acc', section: 'cases', prio: 0, tags: ['case:acc'],
    title: 'Accusative',
    hook: 'The ACCUSED receives the action.',
    why: 'The direct object — the thing the verb is done to. It also measures extent of time or space.',
    ask: 'Ask: the verb happened to what?',
    examples: ['ἠγάπησεν τὸν κόσμον — he loved the world']
  },
  {
    id: 'voc', section: 'cases', prio: 0, tags: ['case:voc'],
    title: 'Vocative',
    hook: 'VOCative is VOCal — you are calling out to someone.',
    why: 'Direct address. Rare enough that when you meet one, someone is being spoken to by name.',
    examples: ['Πάτερ ἡμῶν — Our Father', 'Ἀγαπητοί — Beloved']
  },

  /* ---------- endings ---------- */
  {
    id: 'gen-pl', section: 'endings', tags: ['case:gen', 'number:pl'],
    title: 'Genitive plural is always -ων',
    hook: 'Every genitive plural. Every gender. Every declension. -ων.',
    why: 'This is the single highest-yield ending in the language. Nothing else in the noun system ends in -ων, so seeing it settles both case and number at once.',
    examples: ['τῶν λόγων', 'τῶν γραφῶν', 'τῶν ἔργων', 'τῶν σαρκῶν', 'τῶν ὀνομάτων']
  },
  {
    id: 'dat-sg', section: 'endings', tags: ['case:dat', 'number:sg'],
    title: 'Dative singular hides an iota',
    hook: 'Every dative singular has an iota — subscript in declensions 1 and 2, on the line in declension 3.',
    why: 'That little mark under the vowel is not decoration. It is the case ending.',
    examples: ['λόγῳ, γραφῇ, ὥρᾳ — subscript', 'σαρκί, ὀνόματι, πίστει — written out']
  },
  {
    id: 'dat-pl', section: 'endings', tags: ['case:dat', 'number:pl'],
    title: 'Dative plural: iota next to sigma',
    hook: 'Dative plural puts an iota beside a sigma — -οις, -αις, -σι(ν).',
    why: 'The iota is still there, as it is in every dative; the plural just adds a sigma to it.',
    examples: ['λόγοις, γραφαῖς', 'σαρξίν, ὀνόμασιν, πᾶσιν']
  },
  {
    id: 'acc-sg', section: 'endings', tags: ['case:acc', 'number:sg'],
    title: 'Accusative singular: ν or α',
    hook: 'Declensions 1 and 2 end the accusative singular in ν. Declension 3 usually ends it in α.',
    why: 'A final ν on a noun is nearly always accusative singular. If you meet a final α instead, check whether the genitive gives a consonant stem — that is declension 3.',
    examples: ['λόγον, γραφήν, ὥραν, ἔργον', 'σάρκα, πατέρα, βασιλέα']
  },
  {
    id: 'neuter', section: 'endings', tags: ['gender:n'],
    title: 'The neuter rule',
    hook: 'Neuter never tells you: nominative and accusative are always identical.',
    why: 'ἔργον is both, ἔργα is both, ὄνομα is both. The form cannot decide it for you — the verb and the word order have to. And a neuter plural subject normally takes a singular verb, which is not a mistake: πάντα συνεργεῖ.',
    examples: ['τὸ ἔργον / τὸ ἔργον', 'τὰ ἔργα / τὰ ἔργα']
  },
  {
    id: 'nom-sg-m', section: 'endings', tags: ['case:nom', 'number:sg', 'gender:m'],
    title: 'Masculine nominative singular carries a sigma',
    hook: 'If it is masculine, singular and nominative, look for a ς.',
    why: 'Across all three declensions the sigma keeps showing up — sometimes fused into another letter, as when κ + ς gives ξ.',
    examples: ['λόγος, προφήτης, βασιλεύς', 'σάρξ = σαρκ + ς']
  },
  {
    id: 'third-stem', section: 'endings', tags: ['decl:3rd'],
    title: 'Third declension lies in the nominative',
    hook: 'Take the genitive singular, drop -ος, and there is the real stem.',
    why: 'The nominative of a third declension noun has been mangled by sound changes. The genitive has not. This is why the lexical form always gives you the genitive.',
    examples: ['σάρξ → σαρκός → stem σαρκ-', 'ὄνομα → ὀνόματος → stem ὀνοματ-', 'πατήρ → πατρός → stem πατ(ε)ρ-']
  },
  {
    id: 'article-tells', section: 'endings', tags: ['kind:article'],
    title: 'The article is your informant',
    hook: 'When the noun ending is ambiguous, read the article instead.',
    why: 'τῆς can only be genitive singular feminine, whatever noun follows it. The article is the most regular thing in the language and it is standing right there.',
    examples: ['τῆς — genitive singular feminine, always', 'τῷ — dative singular, masculine or neuter']
  },

  /* ---------- verbs ---------- */
  {
    id: 'augment', section: 'verbs', tags: ['time:past'],
    title: 'The augment means past',
    hook: 'An ἐ- glued to the front says it already happened.',
    why: 'Imperfect, aorist and pluperfect all augment. A verb beginning with a vowel lengthens that vowel instead of adding one — which is why ἀκούω becomes ἤκουσα.',
    examples: ['λύω → ἔλυον, ἔλυσα', 'ἀκούω → ἤκουσα', 'ἐγείρω → ἤγειρα']
  },
  {
    id: 'sigma-future', section: 'verbs', tags: ['tense:future'],
    title: 'Sigma for Soon',
    hook: 'σ before the ending, and no augment in front, means future.',
    why: 'The aorist also has a sigma, but it comes as σα and drags an augment along with it. No augment plus σ plus present-looking endings is the future.',
    examples: ['λύω → λύσω, λύσεις, λύσει', 'compare aorist ἔλυσα — augment plus σα']
  },
  {
    id: 'sa-aorist', section: 'verbs', tags: ['tense:aorist', 'voice:active', 'mood:indicative'], not: ['klass:2aor'],
    title: 'SA is a Single Act',
    hook: 'Augment + stem + σα = first aorist.',
    why: 'The aorist views the action as one whole event, without commenting on how long it took. σα is its fingerprint in the active and middle.',
    examples: ['ἔλυσα, ἐλύσαμεν', 'ἠγάπησεν, ἐποίησεν']
  },
  {
    id: 'theta-passive', section: 'verbs', tags: ['voice:passive'],
    title: 'Theta means it was done TO them',
    hook: 'θη anywhere in a verb is a passive flag.',
    why: 'θη marks the aorist passive, θησ the future passive, θεντ the aorist passive participle, θητι the aorist passive imperative. One letter, one idea.',
    examples: ['ἐλύθην — was loosed', 'λυθήσομαι — will be loosed', 'λυθείς — having been loosed', 'ἐβαπτίσθην, ἐγνώσθην']
  },
  {
    id: 'aor-pass-active-endings', section: 'verbs', tags: ['tense:aorist', 'voice:passive'],
    title: 'The aorist passive takes ACTIVE endings',
    hook: 'ἐλύθην looks active on the end because it is — the passive lives in the θη, not in the ending.',
    why: 'This trips up nearly everyone. Split the word: augment + stem + θη tells you aorist passive, then the secondary active endings just tell you who.',
    examples: ['ἐλύθην, ἐλύθης, ἐλύθη, ἐλύθημεν, ἐλύθητε, ἐλύθησαν']
  },
  {
    id: 'perfect-redup', section: 'verbs', tags: ['tense:perfect'],
    title: 'The perfect stutters',
    hook: 'A repeated first syllable means perfect — and κα makes it active.',
    why: 'Reduplication is the perfect’s signature, and the meaning matches the shape: something happened, and the result of it is still standing.',
    examples: ['λέλυκα, λελύκαμεν', 'γέγονεν — it has come to be, and still is', 'πεπίστευκα, σεσῳσμένοι']
  },
  {
    id: 'subj-long', section: 'verbs', tags: ['mood:subjunctive'],
    title: 'Long vowel, subjunctive mood',
    hook: 'Where you expect a short ο or ε, a long ω or η means subjunctive.',
    why: 'That is the whole mechanism. And you can often see it coming: ἵνα, ἐάν and ὅταν almost always pull a subjunctive after them.',
    examples: ['λύομεν → λύωμεν', 'λύετε → λύητε', 'ἵνα ... ἔχῃ, ἐὰν ὁμολογῶμεν']
  },
  {
    id: 'no-augment-outside-ind', section: 'verbs',
    tags: ['tense:aorist'], not: ['mood:indicative'], prio: 2,
    title: 'No augment outside the indicative',
    hook: 'The augment marks past time only in the indicative. An aorist subjunctive, imperative, infinitive or participle has none.',
    why: 'Outside the indicative the aorist says nothing about when — only that the action is viewed as a single whole. This is exactly why λύσω can be either a future indicative or an aorist subjunctive: the augment that would have separated them was never there.',
    examples: ['ἔλυσα — indicative, augmented', 'λύσω, λύσῃς — subjunctive, no augment', 'λῦσον — imperative, no augment', 'λύσας — participle, no augment']
  },
  {
    id: 'second-aorist', section: 'verbs', tags: ['klass:2aor', 'tense:aorist'],
    title: 'Second aorist: imperfect endings, wrong stem',
    hook: 'If the endings look imperfect but the stem is not the present stem, it is a second aorist.',
    why: 'There is no σα to help you. The only signal is that the stem changed — so second aorists have to be learned as vocabulary, which is exactly what principal part three is for.',
    examples: ['βάλλω → ἔβαλον (not ἔβαλλον)', 'λέγω → εἶπον', 'ἔρχομαι → ἦλθον', 'ὁράω → εἶδον']
  },
  {
    id: 'primary-active', section: 'verbs', tags: ['endings:primary-active'],
    title: 'ω, εις, ει — ομεν, ετε, ουσι',
    hook: 'Say the six out loud until they arrive without thinking.',
    why: 'The plural half is the reliable half: -μεν is always we, -τε is always you plural, -ουσι/-σι is always they. Those three never change across the whole active system.',
    examples: ['λύω, λύεις, λύει, λύομεν, λύετε, λύουσι(ν)']
  },
  {
    id: 'secondary-active', section: 'verbs', tags: ['endings:secondary-active'],
    title: 'ν, ς, — / μεν, τε, ν',
    hook: 'Secondary endings, third singular: nothing at all.',
    why: 'The bare third singular is why ἔλυε has no ending to speak of, just an optional movable ν. Past-time tenses use this set; present, future and perfect use the primary set.',
    examples: ['ἔλυον, ἔλυες, ἔλυε(ν), ἐλύομεν, ἐλύετε, ἔλυον']
  },
  {
    id: 'primary-mp', section: 'verbs', tags: ['endings:primary-mp'],
    title: 'μαι, σαι, ται — μεθα, σθε, νται',
    hook: 'Chant it: my-sigh-tie, meh-tha-sthe-ntai.',
    why: 'This one set covers present, future and perfect in the middle and the passive. It is worth more memorising time than any other six syllables in the verb system.',
    examples: ['λύομαι, λύῃ, λύεται, λυόμεθα, λύεσθε, λύονται']
  },
  {
    id: 'secondary-mp', section: 'verbs', tags: ['endings:secondary-mp'],
    title: 'μην, σο, το — μεθα, σθε, ντο',
    hook: 'The past-time twin of μαι-σαι-ται. Same rhythm, darker vowels.',
    why: 'Imperfect and aorist middle. Note that -μεθα and -σθε are identical in both sets, so only the singular and the third plural do any work.',
    examples: ['ἐλυόμην, ἐλύου, ἐλύετο, ἐλυόμεθα, ἐλύεσθε, ἐλύοντο']
  },
  {
    id: 'mp-same-form', section: 'verbs', tags: ['voice:mp'],
    title: 'Middle and passive look identical here',
    hook: 'Outside the aorist and the future, the middle and the passive share one set of forms.',
    why: 'So λύεται is “he is being loosed” or “he looses for himself”, and only the context decides. This is also why so many verbs are deponent: middle in form, active in meaning.',
    examples: ['ἔρχομαι, γίνομαι, ἀποκρίνομαι — middle in form, active in sense']
  },
  {
    id: 'contract', section: 'verbs', tags: ['klass:contract'],
    title: 'O beats A beats E',
    hook: 'An o-sound swallows anything. Between α and ε, whichever comes first wins.',
    why: 'That is the whole contraction system in one line. The vowel you see is the collision of the stem vowel with the connecting vowel, and the ending underneath is perfectly regular.',
    examples: ['ποιέ-ω → ποιῶ;  ε + ε → ει (ποιεῖς)', 'ἀγαπά-ω → ἀγαπῶ;  α + ει → ᾳ (ἀγαπᾷς)', 'πληρό-ω → πληρῶ;  ο + ε → ου (πληροῦμεν)']
  },

  /* ---------- participles ---------- */
  {
    id: 'ptc-three-bites', section: 'participles', tags: ['mood:participle'],
    title: 'Read a participle in three bites',
    hook: 'Tense marker, then participle morpheme, then case ending.',
    why: 'A participle is a verbal adjective, so it carries tense and voice on the left and case, number and gender on the right. Cut it in the middle and both halves become easy.',
    examples: ['λυ + οντ + ος → present active, genitive singular', 'λυ + θεντ + ες → aorist passive, nominative plural']
  },
  {
    id: 'ptc-men', section: 'participles', tags: ['mood:participle', 'voice:mp'],
    title: '-μεν- in the middle means middle/passive',
    hook: 'See -μεν- buried inside a word and you are looking at a middle or passive participle.',
    why: 'It takes ordinary 2-1-2 adjective endings after that, so once you spot the μεν the rest is just ἀγαθός.',
    examples: ['λυόμενος, λυομένη, λυόμενον', 'γενόμενος, σεσῳσμένοι, ἐλπιζομένων']
  },
  {
    id: 'ptc-time', section: 'participles', tags: ['mood:participle'],
    title: 'Participle time is relative, not absolute',
    hook: 'Present participle: at the same time as the main verb. Aorist participle: before it.',
    why: 'So a present participle is “while ...ing” and an aorist is “having ...ed” — relative to whenever the main verb happens, whether that is past, present or future.',
    examples: ['ὁ πιστεύων — the one believing (right then)', 'πορευθέντες — having gone (first), then μαθητεύσατε']
  },
  {
    id: 'ptc-article', section: 'participles', tags: ['mood:participle', 'case:nom'],
    title: 'Article plus participle makes a noun',
    hook: 'ὁ + participle = “the one who ...”.',
    why: 'Whenever an article sits directly in front of a participle, stop translating it as a verb and start translating it as a person or thing.',
    examples: ['ὁ πιστεύων — the one who believes', 'ὁ μένων ἐν ἐμοί — the one who abides in me', 'τῷ ἐνδυναμοῦντί με — the one who strengthens me']
  },

  /* ---------- reading habits ---------- */
  {
    id: 'prep-space', section: 'reading', tags: [],
    title: 'Prepositions map space by case',
    hook: 'Genitive is out of. Dative is at. Accusative is into.',
    why: 'Many prepositions change meaning depending on the case that follows, and the shift follows that spatial picture. Read the case before you decide the meaning.',
    examples: ['διά + gen = through;  διά + acc = because of', 'μετά + gen = with;  μετά + acc = after', 'ἐν + dat = in;  εἰς + acc = into']
  },
  {
    id: 'follow-article', section: 'reading', tags: [],
    title: 'Follow the article, not the word order',
    hook: 'An article and its noun can be separated by half a clause. The agreement holds anyway.',
    why: 'Greek stuffs modifiers between the article and its noun. When a sentence falls apart, find each article and ask what it agrees with, and the structure reappears.',
    examples: ['ἐν πίστει ζῶ τῇ τοῦ υἱοῦ τοῦ θεοῦ — τῇ reaches all the way back to πίστει']
  },
  {
    id: 'verb-first', section: 'reading', tags: [],
    title: 'Find the verb first',
    hook: 'Parse the verb, and it hands you the subject for free.',
    why: 'The ending already tells you person and number, so before hunting for a nominative, let the verb tell you whether there is one to hunt for.',
    examples: ['ἠγάπησεν — third singular, so look for one subject or none at all']
  },
  {
    id: 'ambiguity', section: 'reading', tags: ['form:ambiguous'], prio: 3,
    title: 'Some forms genuinely are ambiguous',
    hook: 'τῶν is genitive plural in all three genders. λύσω is future indicative or aorist subjunctive.',
    why: 'When a form has more than one parsing, that is a fact about Greek, not a gap in your knowledge. The sentence decides. Getting comfortable holding two options open is part of reading fluently.',
    examples: ['ἀγαπῶμεν — “we love” or “let us love”', 'λύῃ — 2nd singular middle, or 3rd singular subjunctive']
  }
];
