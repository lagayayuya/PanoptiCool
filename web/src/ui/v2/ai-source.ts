/** Source des octets du `.zip` analysé — fonction, pas octets : rien n'est retenu en mémoire tant que
 * l'extraction n'a pas lieu (démo = zip synthétique régénéré ; réel = relecture du `File`).
 *
 * Ce type vit dans son propre module parce que ses lecteurs forment un losange : `ResultsView` monte
 * `AiSection` ET `NoDeductionCard`, et `AiSection` lit `LOW_DATA_THRESHOLD` de `NoDeductionCard`.
 * Le loger dans l'un des trois créerait un cycle d'import. */
export type AiSource = () => Promise<Uint8Array>;
