/* data-nominals.js — article, noun, adjective and pronoun paradigms.
   forms[gender][number] = [nom, gen, dat, acc, voc]  (voc may be null) */
var GK = window.GK || {}; window.GK = GK;

GK.CASES = ['nom', 'gen', 'dat', 'acc', 'voc'];
GK.CASE_LABEL = {
  nom: 'nominative', gen: 'genitive', dat: 'dative',
  acc: 'accusative', voc: 'vocative'
};
GK.NUMBERS = ['sg', 'pl'];
GK.NUMBER_LABEL = { sg: 'singular', pl: 'plural' };
GK.GENDERS = ['m', 'f', 'n'];
GK.GENDER_LABEL = { m: 'masculine', f: 'feminine', n: 'neuter' };

GK.nominals = [
  {
    id: 'article',
    name: 'The article',
    lemma: 'ὁ, ἡ, τό',
    gloss: 'the',
    kind: 'article',
    decl: '2-1-2',
    chapter: 'BBG 6',
    note: 'Learn this cold. Every ending you meet later echoes it.',
    forms: {
      m: { sg: ['ὁ', 'τοῦ', 'τῷ', 'τόν', null], pl: ['οἱ', 'τῶν', 'τοῖς', 'τούς', null] },
      f: { sg: ['ἡ', 'τῆς', 'τῇ', 'τήν', null], pl: ['αἱ', 'τῶν', 'ταῖς', 'τάς', null] },
      n: { sg: ['τό', 'τοῦ', 'τῷ', 'τό', null], pl: ['τά', 'τῶν', 'τοῖς', 'τά', null] }
    }
  },
  {
    id: 'logos',
    name: 'λόγος — 2nd declension masculine',
    lemma: 'λόγος, -ου, ὁ',
    gloss: 'word, statement',
    kind: 'noun',
    decl: '2nd',
    chapter: 'BBG 7',
    forms: {
      m: { sg: ['λόγος', 'λόγου', 'λόγῳ', 'λόγον', 'λόγε'], pl: ['λόγοι', 'λόγων', 'λόγοις', 'λόγους', 'λόγοι'] }
    }
  },
  {
    id: 'ergon',
    name: 'ἔργον — 2nd declension neuter',
    lemma: 'ἔργον, -ου, τό',
    gloss: 'work, deed',
    kind: 'noun',
    decl: '2nd',
    chapter: 'BBG 7',
    note: 'Neuter nominative and accusative are always identical — context decides.',
    forms: {
      n: { sg: ['ἔργον', 'ἔργου', 'ἔργῳ', 'ἔργον', 'ἔργον'], pl: ['ἔργα', 'ἔργων', 'ἔργοις', 'ἔργα', 'ἔργα'] }
    }
  },
  {
    id: 'hora',
    name: 'ὥρα — 1st declension, alpha stem',
    lemma: 'ὥρα, -ας, ἡ',
    gloss: 'hour, time',
    kind: 'noun',
    decl: '1st',
    chapter: 'BBG 8',
    note: 'Stem ends in ε, ι or ρ, so alpha runs all the way through the singular.',
    forms: {
      f: { sg: ['ὥρα', 'ὥρας', 'ὥρᾳ', 'ὥραν', 'ὥρα'], pl: ['ὧραι', 'ὡρῶν', 'ὥραις', 'ὥρας', 'ὧραι'] }
    }
  },
  {
    id: 'graphe',
    name: 'γραφή — 1st declension, eta stem',
    lemma: 'γραφή, -ῆς, ἡ',
    gloss: 'writing, Scripture',
    kind: 'noun',
    decl: '1st',
    chapter: 'BBG 8',
    forms: {
      f: { sg: ['γραφή', 'γραφῆς', 'γραφῇ', 'γραφήν', 'γραφή'], pl: ['γραφαί', 'γραφῶν', 'γραφαῖς', 'γραφάς', 'γραφαί'] }
    }
  },
  {
    id: 'doxa',
    name: 'δόξα — 1st declension, alpha-to-eta',
    lemma: 'δόξα, -ης, ἡ',
    gloss: 'glory',
    kind: 'noun',
    decl: '1st',
    chapter: 'BBG 8',
    note: 'Stem ends in a sibilant, so the singular flips to eta in gen/dat.',
    forms: {
      f: { sg: ['δόξα', 'δόξης', 'δόξῃ', 'δόξαν', 'δόξα'], pl: ['δόξαι', 'δοξῶν', 'δόξαις', 'δόξας', 'δόξαι'] }
    }
  },
  {
    id: 'prophetes',
    name: 'προφήτης — 1st declension masculine',
    lemma: 'προφήτης, -ου, ὁ',
    gloss: 'prophet',
    kind: 'noun',
    decl: '1st',
    chapter: 'BBG 8',
    note: 'A masculine noun with first declension endings — the article gives it away.',
    forms: {
      m: { sg: ['προφήτης', 'προφήτου', 'προφήτῃ', 'προφήτην', 'προφῆτα'], pl: ['προφῆται', 'προφητῶν', 'προφήταις', 'προφήτας', 'προφῆται'] }
    }
  },
  {
    id: 'sarx',
    name: 'σάρξ — 3rd declension, velar stem',
    lemma: 'σάρξ, σαρκός, ἡ',
    gloss: 'flesh',
    kind: 'noun',
    decl: '3rd',
    chapter: 'BBG 10',
    note: 'Find the stem from the genitive singular (σαρκ-), not the nominative.',
    forms: {
      f: { sg: ['σάρξ', 'σαρκός', 'σαρκί', 'σάρκα', 'σάρξ'], pl: ['σάρκες', 'σαρκῶν', 'σαρξί(ν)', 'σάρκας', 'σάρκες'] }
    }
  },
  {
    id: 'onoma',
    name: 'ὄνομα — 3rd declension neuter',
    lemma: 'ὄνομα, -ατος, τό',
    gloss: 'name',
    kind: 'noun',
    decl: '3rd',
    chapter: 'BBG 10',
    forms: {
      n: { sg: ['ὄνομα', 'ὀνόματος', 'ὀνόματι', 'ὄνομα', 'ὄνομα'], pl: ['ὀνόματα', 'ὀνομάτων', 'ὀνόμασι(ν)', 'ὀνόματα', 'ὀνόματα'] }
    }
  },
  {
    id: 'pistis',
    name: 'πίστις — 3rd declension, iota stem',
    lemma: 'πίστις, -εως, ἡ',
    gloss: 'faith, faithfulness',
    kind: 'noun',
    decl: '3rd',
    chapter: 'BBG 11',
    note: 'Watch the genitive singular -εως; it is not the -ος you expect.',
    forms: {
      f: { sg: ['πίστις', 'πίστεως', 'πίστει', 'πίστιν', 'πίστι'], pl: ['πίστεις', 'πίστεων', 'πίστεσι(ν)', 'πίστεις', 'πίστεις'] }
    }
  },
  {
    id: 'pater',
    name: 'πατήρ — 3rd declension, syncopated',
    lemma: 'πατήρ, πατρός, ὁ',
    gloss: 'father',
    kind: 'noun',
    decl: '3rd',
    chapter: 'BBG 11',
    forms: {
      m: { sg: ['πατήρ', 'πατρός', 'πατρί', 'πατέρα', 'πάτερ'], pl: ['πατέρες', 'πατέρων', 'πατράσι(ν)', 'πατέρας', 'πατέρες'] }
    }
  },
  {
    id: 'basileus',
    name: 'βασιλεύς — 3rd declension, upsilon stem',
    lemma: 'βασιλεύς, -έως, ὁ',
    gloss: 'king',
    kind: 'noun',
    decl: '3rd',
    chapter: 'BBG 11',
    forms: {
      m: { sg: ['βασιλεύς', 'βασιλέως', 'βασιλεῖ', 'βασιλέα', 'βασιλεῦ'], pl: ['βασιλεῖς', 'βασιλέων', 'βασιλεῦσι(ν)', 'βασιλεῖς', 'βασιλεῖς'] }
    }
  },
  {
    id: 'agathos',
    name: 'ἀγαθός — 2-1-2 adjective',
    lemma: 'ἀγαθός, -ή, -όν',
    gloss: 'good',
    kind: 'adj',
    decl: '2-1-2',
    chapter: 'BBG 9',
    forms: {
      m: { sg: ['ἀγαθός', 'ἀγαθοῦ', 'ἀγαθῷ', 'ἀγαθόν', 'ἀγαθέ'], pl: ['ἀγαθοί', 'ἀγαθῶν', 'ἀγαθοῖς', 'ἀγαθούς', 'ἀγαθοί'] },
      f: { sg: ['ἀγαθή', 'ἀγαθῆς', 'ἀγαθῇ', 'ἀγαθήν', 'ἀγαθή'], pl: ['ἀγαθαί', 'ἀγαθῶν', 'ἀγαθαῖς', 'ἀγαθάς', 'ἀγαθαί'] },
      n: { sg: ['ἀγαθόν', 'ἀγαθοῦ', 'ἀγαθῷ', 'ἀγαθόν', 'ἀγαθόν'], pl: ['ἀγαθά', 'ἀγαθῶν', 'ἀγαθοῖς', 'ἀγαθά', 'ἀγαθά'] }
    }
  },
  {
    id: 'pas',
    name: 'πᾶς — 3-1-3 adjective',
    lemma: 'πᾶς, πᾶσα, πᾶν',
    gloss: 'each, every; all',
    kind: 'adj',
    decl: '3-1-3',
    chapter: 'BBG 13',
    note: 'Third declension in the masculine and neuter, first declension in the feminine.',
    forms: {
      m: { sg: ['πᾶς', 'παντός', 'παντί', 'πάντα', null], pl: ['πάντες', 'πάντων', 'πᾶσι(ν)', 'πάντας', null] },
      f: { sg: ['πᾶσα', 'πάσης', 'πάσῃ', 'πᾶσαν', null], pl: ['πᾶσαι', 'πασῶν', 'πάσαις', 'πάσας', null] },
      n: { sg: ['πᾶν', 'παντός', 'παντί', 'πᾶν', null], pl: ['πάντα', 'πάντων', 'πᾶσι(ν)', 'πάντα', null] }
    }
  },
  {
    id: 'autos',
    name: 'αὐτός — third person pronoun',
    lemma: 'αὐτός, -ή, -ό',
    gloss: 'he, she, it; him-/her-/itself; same',
    kind: 'pronoun',
    decl: '2-1-2',
    chapter: 'BBG 12',
    note: 'Identical to ἀγαθός except the neuter nom/acc singular drops the final ν.',
    forms: {
      m: { sg: ['αὐτός', 'αὐτοῦ', 'αὐτῷ', 'αὐτόν', null], pl: ['αὐτοί', 'αὐτῶν', 'αὐτοῖς', 'αὐτούς', null] },
      f: { sg: ['αὐτή', 'αὐτῆς', 'αὐτῇ', 'αὐτήν', null], pl: ['αὐταί', 'αὐτῶν', 'αὐταῖς', 'αὐτάς', null] },
      n: { sg: ['αὐτό', 'αὐτοῦ', 'αὐτῷ', 'αὐτό', null], pl: ['αὐτά', 'αὐτῶν', 'αὐτοῖς', 'αὐτά', null] }
    }
  },
  {
    id: 'houtos',
    name: 'οὗτος — near demonstrative',
    lemma: 'οὗτος, αὕτη, τοῦτο',
    gloss: 'this; these',
    kind: 'pronoun',
    decl: '2-1-2',
    chapter: 'BBG 13',
    note: 'If the ending has an ο or ω sound, the stem is τουτ-; otherwise ταυτ-.',
    forms: {
      m: { sg: ['οὗτος', 'τούτου', 'τούτῳ', 'τοῦτον', null], pl: ['οὗτοι', 'τούτων', 'τούτοις', 'τούτους', null] },
      f: { sg: ['αὕτη', 'ταύτης', 'ταύτῃ', 'ταύτην', null], pl: ['αὗται', 'τούτων', 'ταύταις', 'ταύτας', null] },
      n: { sg: ['τοῦτο', 'τούτου', 'τούτῳ', 'τοῦτο', null], pl: ['ταῦτα', 'τούτων', 'τούτοις', 'ταῦτα', null] }
    }
  },
  {
    id: 'ekeinos',
    name: 'ἐκεῖνος — far demonstrative',
    lemma: 'ἐκεῖνος, -η, -ο',
    gloss: 'that; those',
    kind: 'pronoun',
    decl: '2-1-2',
    chapter: 'BBG 13',
    forms: {
      m: { sg: ['ἐκεῖνος', 'ἐκείνου', 'ἐκείνῳ', 'ἐκεῖνον', null], pl: ['ἐκεῖνοι', 'ἐκείνων', 'ἐκείνοις', 'ἐκείνους', null] },
      f: { sg: ['ἐκείνη', 'ἐκείνης', 'ἐκείνῃ', 'ἐκείνην', null], pl: ['ἐκεῖναι', 'ἐκείνων', 'ἐκείναις', 'ἐκείνας', null] },
      n: { sg: ['ἐκεῖνο', 'ἐκείνου', 'ἐκείνῳ', 'ἐκεῖνο', null], pl: ['ἐκεῖνα', 'ἐκείνων', 'ἐκείνοις', 'ἐκεῖνα', null] }
    }
  },
  {
    id: 'hos',
    name: 'ὅς — relative pronoun',
    lemma: 'ὅς, ἥ, ὅ',
    gloss: 'who, which, that',
    kind: 'pronoun',
    decl: '2-1-2',
    chapter: 'BBG 14',
    note: 'Rough breathing plus accent. Do not confuse ὅ (relative) with ὁ (article).',
    forms: {
      m: { sg: ['ὅς', 'οὗ', 'ᾧ', 'ὅν', null], pl: ['οἵ', 'ὧν', 'οἷς', 'οὕς', null] },
      f: { sg: ['ἥ', 'ἧς', 'ᾗ', 'ἥν', null], pl: ['αἵ', 'ὧν', 'αἷς', 'ἅς', null] },
      n: { sg: ['ὅ', 'οὗ', 'ᾧ', 'ὅ', null], pl: ['ἅ', 'ὧν', 'οἷς', 'ἅ', null] }
    }
  },
  {
    id: 'ego',
    name: 'ἐγώ — first person pronoun',
    lemma: 'ἐγώ',
    gloss: 'I; we',
    kind: 'pronoun',
    decl: 'personal',
    chapter: 'BBG 11',
    note: 'The short forms (μου, μοι, με) are unemphatic; the long forms carry stress.',
    genderless: true,
    forms: {
      m: { sg: ['ἐγώ', 'ἐμοῦ', 'ἐμοί', 'ἐμέ', null], pl: ['ἡμεῖς', 'ἡμῶν', 'ἡμῖν', 'ἡμᾶς', null] }
    }
  },
  {
    id: 'su',
    name: 'σύ — second person pronoun',
    lemma: 'σύ',
    gloss: 'you (sg); you (pl)',
    kind: 'pronoun',
    decl: 'personal',
    chapter: 'BBG 11',
    genderless: true,
    forms: {
      m: { sg: ['σύ', 'σοῦ', 'σοί', 'σέ', null], pl: ['ὑμεῖς', 'ὑμῶν', 'ὑμῖν', 'ὑμᾶς', null] }
    }
  },
  {
    id: 'tis',
    name: 'τίς — interrogative pronoun',
    lemma: 'τίς, τί',
    gloss: 'who? what? why?',
    kind: 'pronoun',
    decl: '3rd',
    chapter: 'BBG 14',
    note: 'Always an acute on the first syllable. Unaccented τις / τι means "someone, something".',
    forms: {
      m: { sg: ['τίς', 'τίνος', 'τίνι', 'τίνα', null], pl: ['τίνες', 'τίνων', 'τίσι(ν)', 'τίνας', null] },
      n: { sg: ['τί', 'τίνος', 'τίνι', 'τί', null], pl: ['τίνα', 'τίνων', 'τίσι(ν)', 'τίνα', null] }
    }
  }
];

/* Case-ending charts — the thing worth actually memorising, per Mounce. */
GK.endingCharts = [
  {
    id: 'endings-2-1-2',
    name: 'First and second declension endings',
    chapter: 'BBG 9',
    rows: [
      ['', '2 masc', '1 fem', '2 neut'],
      ['nom sg', 'ς', '—', 'ν'],
      ['gen sg', 'υ', 'ς', 'υ'],
      ['dat sg', 'ι', 'ι', 'ι'],
      ['acc sg', 'ν', 'ν', 'ν'],
      ['nom pl', 'ι', 'ι', 'α'],
      ['gen pl', 'ων', 'ων', 'ων'],
      ['dat pl', 'ις', 'ις', 'ις'],
      ['acc pl', 'υς', 'ς', 'α']
    ]
  },
  {
    id: 'endings-3',
    name: 'Third declension endings',
    chapter: 'BBG 10',
    rows: [
      ['', 'masc / fem', 'neuter'],
      ['nom sg', 'ς or —', '—'],
      ['gen sg', 'ος', 'ος'],
      ['dat sg', 'ι', 'ι'],
      ['acc sg', 'α or ν', '—'],
      ['nom pl', 'ες', 'α'],
      ['gen pl', 'ων', 'ων'],
      ['dat pl', 'σι(ν)', 'σι(ν)'],
      ['acc pl', 'ας', 'α']
    ]
  }
];
