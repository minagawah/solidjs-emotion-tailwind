/** @prettier */

import { createSerializer } from 'jest-emotion';

expect.addSnapshotSerializer(createSerializer());
