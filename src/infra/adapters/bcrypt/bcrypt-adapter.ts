import bcrypt from 'bcrypt';

import { Encrypter } from '@src/modules/client/signup/ports';
import { PasswordCompare } from '@src/modules/client/signin/ports';

export const SALT = 12;

export class BcryptAdapter implements Encrypter, PasswordCompare {
  async encrypt(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, SALT);
    return hashedPassword;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
