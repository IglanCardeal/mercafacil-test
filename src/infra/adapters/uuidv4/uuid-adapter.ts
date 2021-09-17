import { UUIDGenerator } from '@src/services/client/signup/ports';
import * as uuid from 'uuid';

export class UuidAdapter implements UUIDGenerator {
  generate(): string {
    return uuid.v4();
  }
}
