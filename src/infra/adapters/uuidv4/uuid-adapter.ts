import { UUIDGenerator } from '@src/modules/client/signup/ports';
import * as uuid from 'uuid';

export class UuidAdapter implements UUIDGenerator {
  generate(): string {
    return uuid.v4();
  }
}
