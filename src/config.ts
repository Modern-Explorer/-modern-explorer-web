// Feature flags — set via VITE_* env vars so Vite replaces them at build time
// with literal values, guaranteeing dead-code elimination of disabled branches
// (including their dynamic imports, which would otherwise create orphan chunks).
export const CIPHER_ENABLED = import.meta.env.VITE_CIPHER_ENABLED === 'true';
