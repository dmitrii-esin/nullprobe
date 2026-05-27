import type { InitAnswers } from '../types.js';

import { PROTOCOL_README } from './templates/protocol-readme.js';
import { buildVerificationProtocol } from './templates/protocol-verification.js';
import { PROTOCOL_AUDIT } from './templates/protocol-audit.js';
import { PROTOCOL_SECURITY } from './templates/protocol-security.js';
import { PROTOCOL_EXPLORATION } from './templates/protocol-exploration.js';
import { PROTOCOL_CLEANUP } from './templates/protocol-cleanup.js';

export interface ProtocolBundleEntry {
  relPath: string;
  getContent: (answers: InitAnswers) => string;
}

/**
 * Single source of truth for the optional QA protocols bundle.
 * 
 * This eliminates duplication between the files we write and the paths
 * used for overwrite detection.
 * 
 * Future protocols or entire optional bundles should follow this pattern.
 */
export const PROTOCOL_BUNDLE: readonly ProtocolBundleEntry[] = [
  { relPath: 'protocols/README.md', getContent: () => PROTOCOL_README },
  { relPath: 'protocols/verification.md', getContent: (a) => buildVerificationProtocol(a.protocolPriorities ?? []) },
  { relPath: 'protocols/audit.md', getContent: () => PROTOCOL_AUDIT },
  { relPath: 'protocols/security.md', getContent: () => PROTOCOL_SECURITY },
  { relPath: 'protocols/exploration.md', getContent: () => PROTOCOL_EXPLORATION },
  { relPath: 'protocols/cleanup.md', getContent: () => PROTOCOL_CLEANUP },
] as const;

/** Derived list of paths for overwrite guards (used in platforms.ts) */
export const PROTOCOL_PATHS = PROTOCOL_BUNDLE.map(entry => entry.relPath);
