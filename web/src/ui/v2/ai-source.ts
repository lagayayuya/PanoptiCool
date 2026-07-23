/** Source of the analyzed `.zip` bytes — a function, not bytes: nothing is held in memory until
 * the extraction happens (demo = regenerated synthetic zip; real = re-reading the `File`).
 *
 * This type lives in its own module because its readers form a diamond: `ResultsView` mounts
 * `AiSection` AND `NoDeductionCard`, and `AiSection` reads `LOW_DATA_THRESHOLD` from `NoDeductionCard`.
 * Lodging it in one of the three would create an import cycle. */
export type AiSource = () => Promise<Uint8Array>;
