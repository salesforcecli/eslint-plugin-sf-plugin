/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { join } from 'path';
import { getCommandNameParts } from '../../src/shared/commands';

describe('getCommandNameParts', () => {
  it('should return the command name parts', () => {
    expect(getCommandNameParts(join('src', 'commands', 'foo', 'bar.ts'))).toEqual(['foo', 'bar']);
  });
});
