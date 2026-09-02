/* data-verbs.js — verbal paradigms, principal parts, and the master charts.
   forms keys: 1s 2s 3s 1p 2p 3p (imperatives use 2s 3s 2p 3p only). */
var GK = window.GK || {}; window.GK = GK;

GK.PERSONS = ['1', '2', '3'];
GK.PERSON_LABEL = { '1': '1st person', '2': '2nd person', '3': '3rd person' };
GK.TENSES = ['present', 'imperfect', 'future', 'aorist', 'perfect', 'pluperfect'];
GK.TENSE_LABEL = {
  present: 'present', imperfect: 'imperfect', future: 'future',
  aorist: 'aorist', perfect: 'perfect', pluperfect: 'pluperfect'
};
GK.VOICES = ['active', 'middle', 'passive', 'mp'];
GK.VOICE_LABEL = {
  active: 'active', middle: 'middle', passive: 'passive', mp: 'middle/passive'
};
GK.MOODS = ['indicative', 'subjunctive', 'imperative'];
GK.MOOD_LABEL = {
  indicative: 'indicative', subjunctive: 'subjunctive', imperative: 'imperative'
};

GK.verbs = [
  {
    id: 'luo',
    lemma: 'λύω',
    gloss: 'I loose, untie, destroy',
    klass: 'regular ω-verb',
    chapter: 'BBG 16',
    note: 'The model verb. Every ending you learn here transfers everywhere else.',
    principalParts: ['λύω', 'λύσω', 'ἔλυσα', 'λέλυκα', 'λέλυμαι', 'ἐλύθην'],
    paradigms: [
      { tense: 'present', voice: 'active', mood: 'indicative', chapter: 'BBG 16',
        forms: { '1s': 'λύω', '2s': 'λύεις', '3s': 'λύει', '1p': 'λύομεν', '2p': 'λύετε', '3p': 'λύουσι(ν)' } },
      { tense: 'present', voice: 'mp', mood: 'indicative', chapter: 'BBG 18',
        forms: { '1s': 'λύομαι', '2s': 'λύῃ', '3s': 'λύεται', '1p': 'λυόμεθα', '2p': 'λύεσθε', '3p': 'λύονται' } },
      { tense: 'imperfect', voice: 'active', mood: 'indicative', chapter: 'BBG 21',
        forms: { '1s': 'ἔλυον', '2s': 'ἔλυες', '3s': 'ἔλυε(ν)', '1p': 'ἐλύομεν', '2p': 'ἐλύετε', '3p': 'ἔλυον' } },
      { tense: 'imperfect', voice: 'mp', mood: 'indicative', chapter: 'BBG 21',
        forms: { '1s': 'ἐλυόμην', '2s': 'ἐλύου', '3s': 'ἐλύετο', '1p': 'ἐλυόμεθα', '2p': 'ἐλύεσθε', '3p': 'ἐλύοντο' } },
      { tense: 'future', voice: 'active', mood: 'indicative', chapter: 'BBG 19',
        forms: { '1s': 'λύσω', '2s': 'λύσεις', '3s': 'λύσει', '1p': 'λύσομεν', '2p': 'λύσετε', '3p': 'λύσουσι(ν)' } },
      { tense: 'future', voice: 'middle', mood: 'indicative', chapter: 'BBG 19',
        forms: { '1s': 'λύσομαι', '2s': 'λύσῃ', '3s': 'λύσεται', '1p': 'λυσόμεθα', '2p': 'λύσεσθε', '3p': 'λύσονται' } },
      { tense: 'future', voice: 'passive', mood: 'indicative', chapter: 'BBG 24',
        forms: { '1s': 'λυθήσομαι', '2s': 'λυθήσῃ', '3s': 'λυθήσεται', '1p': 'λυθησόμεθα', '2p': 'λυθήσεσθε', '3p': 'λυθήσονται' } },
      { tense: 'aorist', voice: 'active', mood: 'indicative', chapter: 'BBG 22',
        note: 'First aorist: augment + stem + σα.',
        forms: { '1s': 'ἔλυσα', '2s': 'ἔλυσας', '3s': 'ἔλυσε(ν)', '1p': 'ἐλύσαμεν', '2p': 'ἐλύσατε', '3p': 'ἔλυσαν' } },
      { tense: 'aorist', voice: 'middle', mood: 'indicative', chapter: 'BBG 22',
        forms: { '1s': 'ἐλυσάμην', '2s': 'ἐλύσω', '3s': 'ἐλύσατο', '1p': 'ἐλυσάμεθα', '2p': 'ἐλύσασθε', '3p': 'ἐλύσαντο' } },
      { tense: 'aorist', voice: 'passive', mood: 'indicative', chapter: 'BBG 24',
        note: 'Augment + stem + θη + secondary active endings.',
        forms: { '1s': 'ἐλύθην', '2s': 'ἐλύθης', '3s': 'ἐλύθη', '1p': 'ἐλύθημεν', '2p': 'ἐλύθητε', '3p': 'ἐλύθησαν' } },
      { tense: 'perfect', voice: 'active', mood: 'indicative', chapter: 'BBG 25',
        note: 'Reduplication + stem + κα.',
        forms: { '1s': 'λέλυκα', '2s': 'λέλυκας', '3s': 'λέλυκε(ν)', '1p': 'λελύκαμεν', '2p': 'λελύκατε', '3p': 'λελύκασι(ν)' } },
      { tense: 'perfect', voice: 'mp', mood: 'indicative', chapter: 'BBG 25',
        note: 'Reduplication + stem + primary middle/passive endings, no connecting vowel.',
        forms: { '1s': 'λέλυμαι', '2s': 'λέλυσαι', '3s': 'λέλυται', '1p': 'λελύμεθα', '2p': 'λέλυσθε', '3p': 'λέλυνται' } },
      { tense: 'pluperfect', voice: 'active', mood: 'indicative', chapter: 'BBG 25',
        forms: { '1s': '(ἐ)λελύκειν', '2s': '(ἐ)λελύκεις', '3s': '(ἐ)λελύκει', '1p': '(ἐ)λελύκειμεν', '2p': '(ἐ)λελύκειτε', '3p': '(ἐ)λελύκεισαν' } },
      { tense: 'present', voice: 'active', mood: 'subjunctive', chapter: 'BBG 31',
        note: 'Lengthened connecting vowel: ω/η throughout. That is the whole trick.',
        forms: { '1s': 'λύω', '2s': 'λύῃς', '3s': 'λύῃ', '1p': 'λύωμεν', '2p': 'λύητε', '3p': 'λύωσι(ν)' } },
      { tense: 'present', voice: 'mp', mood: 'subjunctive', chapter: 'BBG 31',
        forms: { '1s': 'λύωμαι', '2s': 'λύῃ', '3s': 'λύηται', '1p': 'λυώμεθα', '2p': 'λύησθε', '3p': 'λύωνται' } },
      { tense: 'aorist', voice: 'active', mood: 'subjunctive', chapter: 'BBG 31',
        note: 'No augment outside the indicative.',
        forms: { '1s': 'λύσω', '2s': 'λύσῃς', '3s': 'λύσῃ', '1p': 'λύσωμεν', '2p': 'λύσητε', '3p': 'λύσωσι(ν)' } },
      { tense: 'aorist', voice: 'middle', mood: 'subjunctive', chapter: 'BBG 31',
        forms: { '1s': 'λύσωμαι', '2s': 'λύσῃ', '3s': 'λύσηται', '1p': 'λυσώμεθα', '2p': 'λύσησθε', '3p': 'λύσωνται' } },
      { tense: 'aorist', voice: 'passive', mood: 'subjunctive', chapter: 'BBG 31',
        forms: { '1s': 'λυθῶ', '2s': 'λυθῇς', '3s': 'λυθῇ', '1p': 'λυθῶμεν', '2p': 'λυθῆτε', '3p': 'λυθῶσι(ν)' } },
      { tense: 'present', voice: 'active', mood: 'imperative', chapter: 'BBG 33',
        forms: { '2s': 'λῦε', '3s': 'λυέτω', '2p': 'λύετε', '3p': 'λυέτωσαν' } },
      { tense: 'present', voice: 'mp', mood: 'imperative', chapter: 'BBG 33',
        forms: { '2s': 'λύου', '3s': 'λυέσθω', '2p': 'λύεσθε', '3p': 'λυέσθωσαν' } },
      { tense: 'aorist', voice: 'active', mood: 'imperative', chapter: 'BBG 33',
        forms: { '2s': 'λῦσον', '3s': 'λυσάτω', '2p': 'λύσατε', '3p': 'λυσάτωσαν' } },
      { tense: 'aorist', voice: 'middle', mood: 'imperative', chapter: 'BBG 33',
        forms: { '2s': 'λῦσαι', '3s': 'λυσάσθω', '2p': 'λύσασθε', '3p': 'λυσάσθωσαν' } },
      { tense: 'aorist', voice: 'passive', mood: 'imperative', chapter: 'BBG 33',
        forms: { '2s': 'λύθητι', '3s': 'λυθήτω', '2p': 'λύθητε', '3p': 'λυθήτωσαν' } }
    ],
    infinitives: [
      { tense: 'present', voice: 'active', form: 'λύειν' },
      { tense: 'present', voice: 'mp', form: 'λύεσθαι' },
      { tense: 'future', voice: 'active', form: 'λύσειν' },
      { tense: 'aorist', voice: 'active', form: 'λῦσαι' },
      { tense: 'aorist', voice: 'middle', form: 'λύσασθαι' },
      { tense: 'aorist', voice: 'passive', form: 'λυθῆναι' },
      { tense: 'perfect', voice: 'active', form: 'λελυκέναι' },
      { tense: 'perfect', voice: 'mp', form: 'λελύσθαι' }
    ],
    participles: [
      { tense: 'present', voice: 'active', forms: ['λύων', 'λύουσα', 'λῦον'], gen: 'λύοντος, λυούσης, λύοντος' },
      { tense: 'present', voice: 'mp', forms: ['λυόμενος', 'λυομένη', 'λυόμενον'], gen: 'λυομένου, λυομένης, λυομένου' },
      { tense: 'aorist', voice: 'active', forms: ['λύσας', 'λύσασα', 'λῦσαν'], gen: 'λύσαντος, λυσάσης, λύσαντος' },
      { tense: 'aorist', voice: 'middle', forms: ['λυσάμενος', 'λυσαμένη', 'λυσάμενον'], gen: 'λυσαμένου, λυσαμένης, λυσαμένου' },
      { tense: 'aorist', voice: 'passive', forms: ['λυθείς', 'λυθεῖσα', 'λυθέν'], gen: 'λυθέντος, λυθείσης, λυθέντος' },
      { tense: 'perfect', voice: 'active', forms: ['λελυκώς', 'λελυκυῖα', 'λελυκός'], gen: 'λελυκότος, λελυκυίας, λελυκότος' },
      { tense: 'perfect', voice: 'mp', forms: ['λελυμένος', 'λελυμένη', 'λελυμένον'], gen: 'λελυμένου, λελυμένης, λελυμένου' }
    ]
  },

  {
    id: 'eimi',
    lemma: 'εἰμί',
    gloss: 'I am',
    klass: 'irregular',
    chapter: 'BBG 8',
    note: 'The most common verb in the New Testament, and it obeys nothing. Just know it.',
    principalParts: ['εἰμί', 'ἔσομαι', '—', '—', '—', '—'],
    paradigms: [
      { tense: 'present', voice: 'active', mood: 'indicative', chapter: 'BBG 8',
        forms: { '1s': 'εἰμί', '2s': 'εἶ', '3s': 'ἐστί(ν)', '1p': 'ἐσμέν', '2p': 'ἐστέ', '3p': 'εἰσί(ν)' } },
      { tense: 'imperfect', voice: 'active', mood: 'indicative', chapter: 'BBG 21',
        forms: { '1s': 'ἤμην', '2s': 'ἦς', '3s': 'ἦν', '1p': 'ἦμεν', '2p': 'ἦτε', '3p': 'ἦσαν' } },
      { tense: 'future', voice: 'middle', mood: 'indicative', chapter: 'BBG 19',
        forms: { '1s': 'ἔσομαι', '2s': 'ἔσῃ', '3s': 'ἔσται', '1p': 'ἐσόμεθα', '2p': 'ἔσεσθε', '3p': 'ἔσονται' } },
      { tense: 'present', voice: 'active', mood: 'subjunctive', chapter: 'BBG 31',
        forms: { '1s': 'ὦ', '2s': 'ᾖς', '3s': 'ᾖ', '1p': 'ὦμεν', '2p': 'ἦτε', '3p': 'ὦσι(ν)' } },
      { tense: 'present', voice: 'active', mood: 'imperative', chapter: 'BBG 33',
        forms: { '2s': 'ἴσθι', '3s': 'ἔστω', '2p': 'ἔστε', '3p': 'ἔστωσαν' } }
    ],
    infinitives: [{ tense: 'present', voice: 'active', form: 'εἶναι' }],
    participles: [
      { tense: 'present', voice: 'active', forms: ['ὤν', 'οὖσα', 'ὄν'], gen: 'ὄντος, οὔσης, ὄντος' }
    ]
  },

  {
    id: 'agapao',
    lemma: 'ἀγαπάω',
    gloss: 'I love',
    klass: 'alpha contract',
    chapter: 'BBG 17',
    note: 'α + ο/ω → ω;  α + ε/η → α (long).  The contraction hides the connecting vowel.',
    principalParts: ['ἀγαπάω', 'ἀγαπήσω', 'ἠγάπησα', 'ἠγάπηκα', 'ἠγάπημαι', 'ἠγαπήθην'],
    paradigms: [
      { tense: 'present', voice: 'active', mood: 'indicative', chapter: 'BBG 17',
        forms: { '1s': 'ἀγαπῶ', '2s': 'ἀγαπᾷς', '3s': 'ἀγαπᾷ', '1p': 'ἀγαπῶμεν', '2p': 'ἀγαπᾶτε', '3p': 'ἀγαπῶσι(ν)' } },
      { tense: 'present', voice: 'mp', mood: 'indicative', chapter: 'BBG 18',
        forms: { '1s': 'ἀγαπῶμαι', '2s': 'ἀγαπᾷ', '3s': 'ἀγαπᾶται', '1p': 'ἀγαπώμεθα', '2p': 'ἀγαπᾶσθε', '3p': 'ἀγαπῶνται' } },
      { tense: 'imperfect', voice: 'active', mood: 'indicative', chapter: 'BBG 21',
        forms: { '1s': 'ἠγάπων', '2s': 'ἠγάπας', '3s': 'ἠγάπα', '1p': 'ἠγαπῶμεν', '2p': 'ἠγαπᾶτε', '3p': 'ἠγάπων' } },
      { tense: 'future', voice: 'active', mood: 'indicative', chapter: 'BBG 19',
        note: 'Contract verbs lengthen the stem vowel before the σ — no contraction left to see.',
        forms: { '1s': 'ἀγαπήσω', '2s': 'ἀγαπήσεις', '3s': 'ἀγαπήσει', '1p': 'ἀγαπήσομεν', '2p': 'ἀγαπήσετε', '3p': 'ἀγαπήσουσι(ν)' } },
      { tense: 'aorist', voice: 'active', mood: 'indicative', chapter: 'BBG 22',
        forms: { '1s': 'ἠγάπησα', '2s': 'ἠγάπησας', '3s': 'ἠγάπησε(ν)', '1p': 'ἠγαπήσαμεν', '2p': 'ἠγαπήσατε', '3p': 'ἠγάπησαν' } }
    ],
    infinitives: [
      { tense: 'present', voice: 'active', form: 'ἀγαπᾶν' },
      { tense: 'aorist', voice: 'active', form: 'ἀγαπῆσαι' }
    ],
    participles: [
      { tense: 'present', voice: 'active', forms: ['ἀγαπῶν', 'ἀγαπῶσα', 'ἀγαπῶν'], gen: 'ἀγαπῶντος, ἀγαπώσης, ἀγαπῶντος' }
    ]
  },

  {
    id: 'poieo',
    lemma: 'ποιέω',
    gloss: 'I do, make',
    klass: 'epsilon contract',
    chapter: 'BBG 17',
    note: 'ε + ε → ει;  ε + ο → ου;  ε disappears before a long vowel.',
    principalParts: ['ποιέω', 'ποιήσω', 'ἐποίησα', 'πεποίηκα', 'πεποίημαι', 'ἐποιήθην'],
    paradigms: [
      { tense: 'present', voice: 'active', mood: 'indicative', chapter: 'BBG 17',
        forms: { '1s': 'ποιῶ', '2s': 'ποιεῖς', '3s': 'ποιεῖ', '1p': 'ποιοῦμεν', '2p': 'ποιεῖτε', '3p': 'ποιοῦσι(ν)' } },
      { tense: 'present', voice: 'mp', mood: 'indicative', chapter: 'BBG 18',
        forms: { '1s': 'ποιοῦμαι', '2s': 'ποιῇ', '3s': 'ποιεῖται', '1p': 'ποιούμεθα', '2p': 'ποιεῖσθε', '3p': 'ποιοῦνται' } },
      { tense: 'imperfect', voice: 'active', mood: 'indicative', chapter: 'BBG 21',
        forms: { '1s': 'ἐποίουν', '2s': 'ἐποίεις', '3s': 'ἐποίει', '1p': 'ἐποιοῦμεν', '2p': 'ἐποιεῖτε', '3p': 'ἐποίουν' } },
      { tense: 'aorist', voice: 'active', mood: 'indicative', chapter: 'BBG 22',
        forms: { '1s': 'ἐποίησα', '2s': 'ἐποίησας', '3s': 'ἐποίησε(ν)', '1p': 'ἐποιήσαμεν', '2p': 'ἐποιήσατε', '3p': 'ἐποίησαν' } }
    ],
    infinitives: [
      { tense: 'present', voice: 'active', form: 'ποιεῖν' },
      { tense: 'aorist', voice: 'active', form: 'ποιῆσαι' }
    ],
    participles: [
      { tense: 'present', voice: 'active', forms: ['ποιῶν', 'ποιοῦσα', 'ποιοῦν'], gen: 'ποιοῦντος, ποιούσης, ποιοῦντος' }
    ]
  },

  {
    id: 'pleroo',
    lemma: 'πληρόω',
    gloss: 'I fill, fulfil',
    klass: 'omicron contract',
    chapter: 'BBG 17',
    note: 'ο + long vowel → ω;  ο + ε/ο → ου;  ο + ει/ῃ/οι → οι.',
    principalParts: ['πληρόω', 'πληρώσω', 'ἐπλήρωσα', 'πεπλήρωκα', 'πεπλήρωμαι', 'ἐπληρώθην'],
    paradigms: [
      { tense: 'present', voice: 'active', mood: 'indicative', chapter: 'BBG 17',
        forms: { '1s': 'πληρῶ', '2s': 'πληροῖς', '3s': 'πληροῖ', '1p': 'πληροῦμεν', '2p': 'πληροῦτε', '3p': 'πληροῦσι(ν)' } },
      { tense: 'present', voice: 'mp', mood: 'indicative', chapter: 'BBG 18',
        forms: { '1s': 'πληροῦμαι', '2s': 'πληροῖ', '3s': 'πληροῦται', '1p': 'πληρούμεθα', '2p': 'πληροῦσθε', '3p': 'πληροῦνται' } }
    ],
    infinitives: [{ tense: 'present', voice: 'active', form: 'πληροῦν' }],
    participles: [
      { tense: 'present', voice: 'active', forms: ['πληρῶν', 'πληροῦσα', 'πληροῦν'], gen: 'πληροῦντος, πληρούσης, πληροῦντος' }
    ]
  },

  {
    id: 'ballo',
    lemma: 'βάλλω',
    gloss: 'I throw, put',
    klass: 'second aorist',
    chapter: 'BBG 23',
    note: 'Second aorist: augment + a changed stem + the imperfect (secondary) endings. If the stem differs from the present, it is aorist.',
    principalParts: ['βάλλω', 'βαλῶ', 'ἔβαλον', 'βέβληκα', 'βέβλημαι', 'ἐβλήθην'],
    paradigms: [
      { tense: 'present', voice: 'active', mood: 'indicative', chapter: 'BBG 16',
        forms: { '1s': 'βάλλω', '2s': 'βάλλεις', '3s': 'βάλλει', '1p': 'βάλλομεν', '2p': 'βάλλετε', '3p': 'βάλλουσι(ν)' } },
      { tense: 'aorist', voice: 'active', mood: 'indicative', chapter: 'BBG 23',
        forms: { '1s': 'ἔβαλον', '2s': 'ἔβαλες', '3s': 'ἔβαλε(ν)', '1p': 'ἐβάλομεν', '2p': 'ἐβάλετε', '3p': 'ἔβαλον' } },
      { tense: 'aorist', voice: 'middle', mood: 'indicative', chapter: 'BBG 23',
        forms: { '1s': 'ἐβαλόμην', '2s': 'ἐβάλου', '3s': 'ἐβάλετο', '1p': 'ἐβαλόμεθα', '2p': 'ἐβάλεσθε', '3p': 'ἐβάλοντο' } },
      { tense: 'aorist', voice: 'active', mood: 'subjunctive', chapter: 'BBG 31',
        forms: { '1s': 'βάλω', '2s': 'βάλῃς', '3s': 'βάλῃ', '1p': 'βάλωμεν', '2p': 'βάλητε', '3p': 'βάλωσι(ν)' } }
    ],
    infinitives: [
      { tense: 'present', voice: 'active', form: 'βάλλειν' },
      { tense: 'aorist', voice: 'active', form: 'βαλεῖν' }
    ],
    participles: [
      { tense: 'aorist', voice: 'active', forms: ['βαλών', 'βαλοῦσα', 'βαλόν'], gen: 'βαλόντος, βαλούσης, βαλόντος' }
    ]
  },

  {
    id: 'erchomai',
    lemma: 'ἔρχομαι',
    gloss: 'I come, go',
    klass: 'deponent / second aorist',
    chapter: 'BBG 18',
    note: 'Middle in form, active in meaning. Never translate it passively.',
    principalParts: ['ἔρχομαι', 'ἐλεύσομαι', 'ἦλθον', 'ἐλήλυθα', '—', '—'],
    paradigms: [
      { tense: 'present', voice: 'mp', mood: 'indicative', chapter: 'BBG 18',
        forms: { '1s': 'ἔρχομαι', '2s': 'ἔρχῃ', '3s': 'ἔρχεται', '1p': 'ἐρχόμεθα', '2p': 'ἔρχεσθε', '3p': 'ἔρχονται' } },
      { tense: 'imperfect', voice: 'mp', mood: 'indicative', chapter: 'BBG 21',
        forms: { '1s': 'ἠρχόμην', '2s': 'ἤρχου', '3s': 'ἤρχετο', '1p': 'ἠρχόμεθα', '2p': 'ἤρχεσθε', '3p': 'ἤρχοντο' } },
      { tense: 'aorist', voice: 'active', mood: 'indicative', chapter: 'BBG 23',
        forms: { '1s': 'ἦλθον', '2s': 'ἦλθες', '3s': 'ἦλθε(ν)', '1p': 'ἤλθομεν', '2p': 'ἤλθετε', '3p': 'ἦλθον' } },
      { tense: 'future', voice: 'middle', mood: 'indicative', chapter: 'BBG 19',
        forms: { '1s': 'ἐλεύσομαι', '2s': 'ἐλεύσῃ', '3s': 'ἐλεύσεται', '1p': 'ἐλευσόμεθα', '2p': 'ἐλεύσεσθε', '3p': 'ἐλεύσονται' } }
    ],
    infinitives: [
      { tense: 'present', voice: 'mp', form: 'ἔρχεσθαι' },
      { tense: 'aorist', voice: 'active', form: 'ἐλθεῖν' }
    ],
    participles: [
      { tense: 'aorist', voice: 'active', forms: ['ἐλθών', 'ἐλθοῦσα', 'ἐλθόν'], gen: 'ἐλθόντος, ἐλθούσης, ἐλθόντος' }
    ]
  },

  {
    id: 'ginomai',
    lemma: 'γίνομαι',
    gloss: 'I become, am, happen',
    klass: 'deponent / second aorist',
    chapter: 'BBG 18',
    principalParts: ['γίνομαι', 'γενήσομαι', 'ἐγενόμην', 'γέγονα', 'γεγένημαι', 'ἐγενήθην'],
    paradigms: [
      { tense: 'present', voice: 'mp', mood: 'indicative', chapter: 'BBG 18',
        forms: { '1s': 'γίνομαι', '2s': 'γίνῃ', '3s': 'γίνεται', '1p': 'γινόμεθα', '2p': 'γίνεσθε', '3p': 'γίνονται' } },
      { tense: 'aorist', voice: 'middle', mood: 'indicative', chapter: 'BBG 23',
        forms: { '1s': 'ἐγενόμην', '2s': 'ἐγένου', '3s': 'ἐγένετο', '1p': 'ἐγενόμεθα', '2p': 'ἐγένεσθε', '3p': 'ἐγένοντο' } },
      { tense: 'perfect', voice: 'active', mood: 'indicative', chapter: 'BBG 25',
        forms: { '1s': 'γέγονα', '2s': 'γέγονας', '3s': 'γέγονε(ν)', '1p': 'γεγόναμεν', '2p': 'γεγόνατε', '3p': 'γεγόνασι(ν)' } }
    ],
    infinitives: [{ tense: 'aorist', voice: 'middle', form: 'γενέσθαι' }],
    participles: [
      { tense: 'aorist', voice: 'middle', forms: ['γενόμενος', 'γενομένη', 'γενόμενον'], gen: 'γενομένου, γενομένης, γενομένου' }
    ]
  },

  {
    id: 'didomi',
    lemma: 'δίδωμι',
    gloss: 'I give',
    klass: 'μι-verb',
    chapter: 'BBG 34',
    note: 'μι-verbs reduplicate with iota and use their own endings. Learn δίδωμι and the rest fall in line.',
    principalParts: ['δίδωμι', 'δώσω', 'ἔδωκα', 'δέδωκα', 'δέδομαι', 'ἐδόθην'],
    paradigms: [
      { tense: 'present', voice: 'active', mood: 'indicative', chapter: 'BBG 34',
        forms: { '1s': 'δίδωμι', '2s': 'δίδως', '3s': 'δίδωσι(ν)', '1p': 'δίδομεν', '2p': 'δίδοτε', '3p': 'διδόασι(ν)' } },
      { tense: 'imperfect', voice: 'active', mood: 'indicative', chapter: 'BBG 34',
        forms: { '1s': 'ἐδίδουν', '2s': 'ἐδίδους', '3s': 'ἐδίδου', '1p': 'ἐδίδομεν', '2p': 'ἐδίδοτε', '3p': 'ἐδίδοσαν' } },
      { tense: 'aorist', voice: 'active', mood: 'indicative', chapter: 'BBG 34',
        forms: { '1s': 'ἔδωκα', '2s': 'ἔδωκας', '3s': 'ἔδωκε(ν)', '1p': 'ἐδώκαμεν', '2p': 'ἐδώκατε', '3p': 'ἔδωκαν' } }
    ],
    infinitives: [
      { tense: 'present', voice: 'active', form: 'διδόναι' },
      { tense: 'aorist', voice: 'active', form: 'δοῦναι' }
    ],
    participles: [
      { tense: 'aorist', voice: 'active', forms: ['δούς', 'δοῦσα', 'δόν'], gen: 'δόντος, δούσης, δόντος' }
    ]
  }
];

/* Principal parts worth having by heart. */
GK.principalParts = [
  { lemma: 'ἀγαπάω', gloss: 'I love', parts: ['ἀγαπάω', 'ἀγαπήσω', 'ἠγάπησα', 'ἠγάπηκα', 'ἠγάπημαι', 'ἠγαπήθην'] },
  { lemma: 'ἀκούω', gloss: 'I hear', parts: ['ἀκούω', 'ἀκούσω', 'ἤκουσα', 'ἀκήκοα', '—', 'ἠκούσθην'] },
  { lemma: 'αἴρω', gloss: 'I take up, take away', parts: ['αἴρω', 'ἀρῶ', 'ἦρα', 'ἦρκα', 'ἦρμαι', 'ἤρθην'] },
  { lemma: 'ἀποθνῄσκω', gloss: 'I die', parts: ['ἀποθνῄσκω', 'ἀποθανοῦμαι', 'ἀπέθανον', '—', '—', '—'] },
  { lemma: 'ἀποκρίνομαι', gloss: 'I answer', parts: ['ἀποκρίνομαι', '—', 'ἀπεκρινάμην', '—', '—', 'ἀπεκρίθην'] },
  { lemma: 'ἀποστέλλω', gloss: 'I send', parts: ['ἀποστέλλω', 'ἀποστελῶ', 'ἀπέστειλα', 'ἀπέσταλκα', 'ἀπέσταλμαι', 'ἀπεστάλην'] },
  { lemma: 'βάλλω', gloss: 'I throw, put', parts: ['βάλλω', 'βαλῶ', 'ἔβαλον', 'βέβληκα', 'βέβλημαι', 'ἐβλήθην'] },
  { lemma: 'βαπτίζω', gloss: 'I baptise', parts: ['βαπτίζω', 'βαπτίσω', 'ἐβάπτισα', '—', 'βεβάπτισμαι', 'ἐβαπτίσθην'] },
  { lemma: 'βλέπω', gloss: 'I see', parts: ['βλέπω', 'βλέψω', 'ἔβλεψα', '—', '—', '—'] },
  { lemma: 'γίνομαι', gloss: 'I become, happen', parts: ['γίνομαι', 'γενήσομαι', 'ἐγενόμην', 'γέγονα', 'γεγένημαι', 'ἐγενήθην'] },
  { lemma: 'γινώσκω', gloss: 'I know', parts: ['γινώσκω', 'γνώσομαι', 'ἔγνων', 'ἔγνωκα', 'ἔγνωσμαι', 'ἐγνώσθην'] },
  { lemma: 'γράφω', gloss: 'I write', parts: ['γράφω', 'γράψω', 'ἔγραψα', 'γέγραφα', 'γέγραμμαι', 'ἐγράφην'] },
  { lemma: 'διδάσκω', gloss: 'I teach', parts: ['διδάσκω', 'διδάξω', 'ἐδίδαξα', '—', '—', 'ἐδιδάχθην'] },
  { lemma: 'δίδωμι', gloss: 'I give', parts: ['δίδωμι', 'δώσω', 'ἔδωκα', 'δέδωκα', 'δέδομαι', 'ἐδόθην'] },
  { lemma: 'ἐγείρω', gloss: 'I raise up', parts: ['ἐγείρω', 'ἐγερῶ', 'ἤγειρα', '—', 'ἐγήγερμαι', 'ἠγέρθην'] },
  { lemma: 'ἔρχομαι', gloss: 'I come, go', parts: ['ἔρχομαι', 'ἐλεύσομαι', 'ἦλθον', 'ἐλήλυθα', '—', '—'] },
  { lemma: 'ἐσθίω', gloss: 'I eat', parts: ['ἐσθίω', 'φάγομαι', 'ἔφαγον', '—', '—', '—'] },
  { lemma: 'ἔχω', gloss: 'I have', parts: ['ἔχω', 'ἕξω', 'ἔσχον', 'ἔσχηκα', '—', '—'] },
  { lemma: 'θέλω', gloss: 'I wish, will', parts: ['θέλω', 'θελήσω', 'ἠθέλησα', '—', '—', '—'] },
  { lemma: 'καλέω', gloss: 'I call', parts: ['καλέω', 'καλέσω', 'ἐκάλεσα', 'κέκληκα', 'κέκλημαι', 'ἐκλήθην'] },
  { lemma: 'λαμβάνω', gloss: 'I take, receive', parts: ['λαμβάνω', 'λήμψομαι', 'ἔλαβον', 'εἴληφα', 'εἴλημμαι', 'ἐλήμφθην'] },
  { lemma: 'λέγω', gloss: 'I say', parts: ['λέγω', 'ἐρῶ', 'εἶπον', 'εἴρηκα', 'εἴρημαι', 'ἐρρέθην'] },
  { lemma: 'λύω', gloss: 'I loose', parts: ['λύω', 'λύσω', 'ἔλυσα', 'λέλυκα', 'λέλυμαι', 'ἐλύθην'] },
  { lemma: 'μένω', gloss: 'I remain', parts: ['μένω', 'μενῶ', 'ἔμεινα', 'μεμένηκα', '—', '—'] },
  { lemma: 'ὁράω', gloss: 'I see', parts: ['ὁράω', 'ὄψομαι', 'εἶδον', 'ἑώρακα', '—', 'ὤφθην'] },
  { lemma: 'πιστεύω', gloss: 'I believe', parts: ['πιστεύω', 'πιστεύσω', 'ἐπίστευσα', 'πεπίστευκα', 'πεπίστευμαι', 'ἐπιστεύθην'] },
  { lemma: 'ποιέω', gloss: 'I do, make', parts: ['ποιέω', 'ποιήσω', 'ἐποίησα', 'πεποίηκα', 'πεποίημαι', 'ἐποιήθην'] },
  { lemma: 'σῴζω', gloss: 'I save', parts: ['σῴζω', 'σώσω', 'ἔσωσα', 'σέσωκα', 'σέσῳσμαι', 'ἐσώθην'] }
];

GK.PP_LABELS = [
  'present active', 'future active', 'aorist active',
  'perfect active', 'perfect mid/pass', 'aorist passive'
];

/* The charts Mounce tells you to memorise rather than derive. */
GK.verbCharts = [
  {
    id: 'endings-primary-active',
    name: 'Primary active endings',
    caption: 'Used in the present, future and perfect. The parenthesised letters are what the connecting vowel swallows.',
    rows: [
      ['', 'singular', 'plural'],
      ['1st', 'ω  (from ο + —)', 'μεν'],
      ['2nd', 'ς  (→ εις)', 'τε'],
      ['3rd', 'ι  (→ ει)', 'νσι  (→ ουσι(ν))']
    ]
  },
  {
    id: 'endings-secondary-active',
    name: 'Secondary active endings',
    caption: 'Used in the imperfect, aorist and pluperfect — the augmented tenses.',
    rows: [
      ['', 'singular', 'plural'],
      ['1st', 'ν', 'μεν'],
      ['2nd', 'ς', 'τε'],
      ['3rd', '—  (or ν movable)', 'ν  (→ ον / σαν)']
    ]
  },
  {
    id: 'endings-primary-mp',
    name: 'Primary middle/passive endings',
    caption: 'Present, future and perfect middle or passive.',
    rows: [
      ['', 'singular', 'plural'],
      ['1st', 'μαι', 'μεθα'],
      ['2nd', 'σαι  (→ ῃ)', 'σθε'],
      ['3rd', 'ται', 'νται']
    ]
  },
  {
    id: 'endings-secondary-mp',
    name: 'Secondary middle/passive endings',
    caption: 'Imperfect and aorist middle or passive.',
    rows: [
      ['', 'singular', 'plural'],
      ['1st', 'μην', 'μεθα'],
      ['2nd', 'σο  (→ ου)', 'σθε'],
      ['3rd', 'το', 'ντο']
    ]
  },
  {
    id: 'master-chart',
    name: 'Tense formatives — the master chart',
    caption: 'Augment or reduplication + stem + tense formative + connecting vowel + ending. Spot the formative and the tense names itself.',
    rows: [
      ['tense / voice', 'augment or redup.', 'formative', 'endings'],
      ['present act', '—', '—', 'primary active'],
      ['present mid/pass', '—', '—', 'primary mid/pass'],
      ['imperfect act', 'ἐ', '—', 'secondary active'],
      ['imperfect mid/pass', 'ἐ', '—', 'secondary mid/pass'],
      ['future act', '—', 'σ', 'primary active'],
      ['future mid', '—', 'σ', 'primary mid/pass'],
      ['future pass', '—', 'θησ', 'primary mid/pass'],
      ['1st aorist act', 'ἐ', 'σα', 'secondary active'],
      ['1st aorist mid', 'ἐ', 'σα', 'secondary mid/pass'],
      ['2nd aorist act', 'ἐ', 'changed stem', 'secondary active'],
      ['aorist pass', 'ἐ', 'θη', 'secondary active'],
      ['perfect act', 'redup. + ε', 'κα', 'primary active'],
      ['perfect mid/pass', 'redup. + ε', '—', 'primary mid/pass']
    ]
  },
  {
    id: 'participle-morphemes',
    name: 'Participle morphemes',
    caption: 'Tense stem + participle morpheme + case ending. Adverbial participles are usually translated with "-ing" (present) or "having ..." (aorist).',
    rows: [
      ['tense / voice', 'masc / neut', 'feminine', 'example'],
      ['present act', 'οντ', 'ουσα', 'λύων, λύουσα, λῦον'],
      ['present mid/pass', 'ομεν', 'ομεν', 'λυόμενος, -η, -ον'],
      ['1st aorist act', 'σαντ', 'σασα', 'λύσας, λύσασα, λῦσαν'],
      ['2nd aorist act', 'οντ', 'ουσα', 'βαλών, βαλοῦσα, βαλόν'],
      ['aorist mid', 'σαμεν', 'σαμεν', 'λυσάμενος, -η, -ον'],
      ['aorist pass', 'θεντ', 'θεισα', 'λυθείς, λυθεῖσα, λυθέν'],
      ['perfect act', 'κοτ', 'κυια', 'λελυκώς, λελυκυῖα, λελυκός'],
      ['perfect mid/pass', 'μεν', 'μεν', 'λελυμένος, -η, -ον']
    ]
  }
];
