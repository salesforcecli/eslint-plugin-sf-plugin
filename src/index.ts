// ./src/index.ts
import { noDuplicateShortCharacters } from './rules/noDuplicateShortCharacters';
import { flagCasing } from './rules/flagCasing';
import { extractMessage } from './rules/extractMessage'
import { flagCrossReferences } from './rules/flagCrossReferences';

module.exports = {
    rules: {
      'no-duplicate-short-characters': {
        create: noDuplicateShortCharacters,
      },
      'flag-case': {
        create: flagCasing,
      },
      'no-hardcoded-messages': {
        create: extractMessage,
      },
      'flag-cross-references': {
        create: flagCrossReferences
      }
    },
};
