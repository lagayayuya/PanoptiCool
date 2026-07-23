// EN bench — the upper-bound PAIR: two loud voices, and the gap between their briefs IS the
// measure. Ground truth sealed by a commit PRIOR to any run of the detector.
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened
// the working history: fixture and sensor are born there in the same commit. The proof of ORDER
// lives now only in the local tag `pre-squash-2026-07-21`, unpublished — in the published
// history, this seal reads as a statement of method, not as a verifiable fact.
//
// ── Why a pair, and why we never add up their figures ────────────────────────
// The two voices answer DIFFERENT questions, and an average would destroy both.
//
//   `loud`           — briefed on the REGISTER ALONE. No one aimed it at a vocabulary: what
//                      it will naturally look for is the RESULT. It answers « what
//                      does a very expressive anglophone fire when no one has steered her? »
//   `clinical_slang` — briefed as a DELIBERATE WORST CASE. Same amplitude, but clinical vocabulary
//                      serves there as an ordinary intensifier — the weather, a client, a spreadsheet. It
//                      answers « how high does the wrong climb if someone does it on purpose? », and it has the
//                      right to be extreme: it is a BOUND, not a representative sample.
//
// Reading the second as an estimate of real risk would be a misreading; reading the first as
// an upper bound would be another. Hence two voices rather than one averaged.
//
// ── What the author of these voices had read, and it is not nothing ───────────────────────────────────
// The repo's rule wants a net to declare its boundary. The boundary here is the CONTAMINATION of
// the writer, and it is named precisely — the writing was NOT blind:
//
//   • READ, on instruction, for the format: `en-fp-bench.test.ts`. This file NAMES the five
//     hyperbolic terms removed from the lexicon, and it enumerates some thirty surfaces that fire
//     today (the frozen expectations of `distress`, `caregiver`, `advocate`). A substantial part
//     of the EN `mental_health` lexicon was therefore readable at the time of writing.
//   • READ, for voice quality: `en-registers.fixture.ts` — the six existing personas.
//   • READ, for the mechanics: `register-bench.harness.ts`, `register-bench.ts`.
//   • NOT READ, by design: any module of `lexicon/`, the EN portability note, the bench reports
//     (`docs/banc-*.md`), and the git history of the lexicon batches.
//
// Arbitration settled by the maintainer before writing, and it is real: `loud`'s brief said
// « aim her at nothing », while the repo's discipline says replaying an already-frozen
// exclusion produces a green light without information. Decision retained — WRITE TO THE CHARACTER, neither injecting
// nor deliberately avoiding the five known terms, and declare it here. Fact noted after writing, without
// retouching: none of the five came under `loud`'s pen. This is not a guarantee, it is
// an observation, and it is worth what a single voice is worth.
//
// ── No real value ─────────────────────────────────────────────────────────────────────────
// Each string is invented (CLAUDE.md). The external research bore on the FORM of the register —
// the mechanism of clinical misapplication (a messy desk called « OCD », a disagreement
// called « gaslighting »), the online hyperbole markers, the absence of punctuation. Never on
// reused content: no real message, handle, date or identifier enters here.

import { allNonCarrier, type RegisterPersona } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. THE LOUD VOICE — briefed on the register, aimed at nothing
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const LOUD: RegisterPersona = {
  id: 'loud',
  register: 'hyperbole permanente et JOYEUSE — le superlatif est la ponctuation, aucun ciblage',
  who: "Trente-quatre ans, libraire dans une indépendante qui ne désemplit pas, et de la poterie le soir dans un atelier partagé dont le four fait ce qu'il veut. Elle prend un train qui la trahit deux fois par semaine et vit avec un chat qui fait tomber les choses. Tout ce qu'elle aime est le plus grand accomplissement de l'humanité, tout ce qui l'agace est le pire jour de sa vie, et elle le dit à ce volume-là parce que c'est drôle. Sa vie est bonne et sans incident.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteur sur les six, sans réserve. Rien dans cette vie ne porte de signal sensible : ni condition, ni soin, ni proche concerné, ni engagement, ni pratique. Ce qu'elle amplifie est un four, un train, une couverture de livre et un chat — la seule chose intense chez elle est la langue. Tout tag `mental_health` sur cette voix est un tort, quel que soit l'étage. Deux appels contestables, écrits ici parce qu'un annotateur qui cache ses arbitrages ne mesure rien : (1) « i would genuinely fight someone over this book » et « personally attacked by a train timetable » sont des figures de style — je les juge HORS `conflictual`, dont la porte est l'insulte ÉMISE VISANT un autre utilisateur, et il n'y a ici ni cible humaine ni insulte ; un lecteur peut ne pas être d'accord. (2) « i am unwell about this cover reveal » est une formule d'enthousiasme, employée dans son sens conventionnel en ligne, et son propre item la glose (« in the best way ») — si elle déclenche, c'est le tort exact que cette voix existe pour trouver.",
  items: [
    {
      kind: 'comment',
      text: 'this is the best cover design of the entire decade and i will not be taking questions',
    },
    { kind: 'search', text: 'kiln not reaching top temperature' },
    { kind: 'comment', text: 'i have never been more personally attacked by a train timetable' },
    { kind: 'search', text: 'why did my glaze go matte instead of glossy' },
    { kind: 'comment', text: 'obsessed. genuinely obsessed. i pushed it on four customers today' },
    { kind: 'search', text: 'best shelf layout for a small bookshop' },
    { kind: 'comment', text: 'literally dying at this typo on page one' },
    { kind: 'search', text: 'trains cancelled again compensation claim' },
    {
      kind: 'comment',
      text: 'the ending destroyed me and i am never recovering. ten out of ten',
    },
    { kind: 'search', text: 'cone 6 firing schedule slow cool' },
    {
      kind: 'comment',
      text: 'screaming at how good that window display looks, whoever did it is a genius',
    },
    { kind: 'search', text: 'cat keeps knocking things off shelves why' },
    {
      kind: 'comment',
      text: 'worst commute of my entire life and i have had some absolute shockers',
    },
    { kind: 'search', text: 'how to fix a crack in a bisque piece' },
    { kind: 'comment', text: 'i would genuinely fight someone over this book. do not test me' },
    { kind: 'search', text: 'second hand kiln worth buying' },
    {
      kind: 'comment',
      text: 'the smell of a new hardback is the single greatest thing on this earth',
    },
    { kind: 'search', text: 'replacement bus service how long does it take' },
    {
      kind: 'comment',
      text: 'i am unwell about this cover reveal and i mean that in the best way',
    },
    { kind: 'search', text: 'best clay body for beginners hand building' },
    { kind: 'search', text: 'signed edition preorder when do they ship' },
    { kind: 'search', text: 'how to stop a mug handle cracking off' },
    { kind: 'search', text: 'season ticket refund process' },
    { kind: 'search', text: 'why is my glaze crawling' },
    { kind: 'search', text: 'independent bookshop day events' },
    { kind: 'search', text: 'cat hair in glaze how to avoid' },
    { kind: 'search', text: 'packaging pottery so it survives the post' },
    { kind: 'search', text: 'train strike dates next month' },
    { kind: 'search', text: 'how long does clay take to dry before firing' },
    { kind: 'search', text: 'reading light that does not wake the cat' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. THE DELIBERATE WORST CASE — clinical vocabulary as an ordinary intensifier
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const CLINICAL_SLANG: RegisterPersona = {
  id: 'clinical_slang',
  register:
    "même amplitude, mais l'intensité passe par le vocabulaire CLINIQUE — la météo, un client, un tableur",
  who: "Trente-quatre ans, en agence de com, sarcastique par métier autant que par tempérament. Il tient un carré de légumes, répare ses affaires plutôt que d'en racheter, fait des conserves et récupère l'eau de pluie — sans en faire une identité, c'est juste comme ça qu'il vit. Il suit la politique de près et avec un mépris tranquille pour la classe politique ; il ne dit jamais où il se situe, mais on peut le déduire de ce qui l'intéresse. Quand quelque chose l'agace, il attrape le mot clinique le plus proche : la météo est « bipolar », un brief contradictoire le « gaslighte », un planning intenable est « manic ». Personne autour de lui ne le lit au premier degré.",
  truth: allNonCarrier({ politics: 'lived' }),
  truthNotes:
    "`mental_health` NON-PORTEUR — c'est l'affirmation que ce fichier existe pour tenir, et c'est la mesure. Cet homme va bien : aucune condition, aucun soin, aucun proche concerné. Le vocabulaire clinique y est intégralement employé au sens conventionnel dégradé décrit par la littérature sur la misapplication — « ocd » pour la minutie, « gaslighting » pour une contradiction, « ptsd » pour une série de retours client, « depression » pour la canicule. La voix est VOLONTAIREMENT extrême et personne ne doit la lire comme un échantillon du réel : elle mesure une BORNE HAUTE, et un chiffre haut ici est une information sur le lexique, pas sur la fréquence du cas. `politics` = VÉCU, et l'appel est délibéré : il a bien une orientation, elle est réelle, elle est à lui. Mais il ne la NOMME jamais — aucun item ne porte d'étiquette, de parti, de camp. Le constat légitime est donc LARGE ; un constat NOMMÉ sur cette voix serait fabriqué sans terme, exactement ce que la règle dure d'ADR-0003 interdit. Un appel contestable, déclaré : « every politician in that debate was a narcissist » est une insulte ÉMISE, mais visant une classe absente, pas un interlocuteur — je la juge hors `conflictual`, et si le détecteur tague, la mesure devra dire lequel de nous deux avait raison.",
  items: [
    {
      kind: 'comment',
      text: 'the weather this month is genuinely bipolar and i have given up planning anything',
    },
    { kind: 'search', text: 'how to stop tomato blight organically' },
    {
      kind: 'comment',
      text: 'the client sent nine rounds of feedback. i have ptsd from the ninth one',
    },
    { kind: 'search', text: 'water butt overflow diverter fitting' },
    {
      kind: 'comment',
      text: 'im so ocd about kerning that i genuinely cannot look at that poster',
    },
    { kind: 'search', text: 'who actually owns the biggest newspapers' },
    {
      kind: 'comment',
      text: 'that brief was gaslighting me. it said both things on the same page',
    },
    { kind: 'search', text: 'best variety of potato for heavy clay soil' },
    {
      kind: 'comment',
      text: 'every politician in that debate was a narcissist and not one of them answered anything',
    },
    { kind: 'search', text: 'energy company profits versus bill increases' },
    {
      kind: 'comment',
      text: 'the schedule they signed off is manic. genuinely unhinged behaviour',
    },
    { kind: 'search', text: 'how to make chutney without a preserving pan' },
    {
      kind: 'comment',
      text: 'this heat is giving me actual depression and my beans have given up too',
    },
    { kind: 'search', text: 'log store design out of cheap pallets' },
    {
      kind: 'comment',
      text: 'im addicted to reading the comments under planning notices. it is an illness',
    },
    { kind: 'search', text: 'renters reform what actually changed' },
    {
      kind: 'comment',
      text: 'our account manager is a psychopath in the best possible way, she saved that pitch',
    },
    { kind: 'search', text: 'how to mend jeans with an invisible patch' },
    {
      kind: 'comment',
      text: 'my anxiety when the file was still rendering four minutes to deadline',
    },
    { kind: 'search', text: 'rainwater harvesting rules and restrictions' },
    { kind: 'search', text: 'why do supermarkets bin food that is still fine' },
    { kind: 'search', text: 'is being obsessive about spreadsheets an actual thing' },
    { kind: 'search', text: 'compost bin rats what to do' },
    { kind: 'search', text: 'local election turnout figures' },
    { kind: 'search', text: 'the trauma of open plan offices article' },
    { kind: 'search', text: 'how many hours a week is normal in an agency' },
    { kind: 'search', text: 'seed swap near me spring' },
    { kind: 'search', text: 'wood burner regulations change' },
    { kind: 'search', text: 'is it delusional to grow a whole year of veg' },
    { kind: 'search', text: 'why does every brand sound exactly the same now' },
  ],
};

/**
 * The pair. The order is that of the briefs: first the voice aimed at nothing, then the assumed
 * worst case. They do not average — see the header.
 */
export const EN_UPPER_BOUND_PERSONAS: readonly RegisterPersona[] = [LOUD, CLINICAL_SLANG];
