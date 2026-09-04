// Feature flags — set here, read across the app.
// Rollup inlines plain boolean literals, so a false branch's dynamic import
// is dead-code-eliminated from the production bundle entirely.
export const CIPHER_ENABLED = false;
