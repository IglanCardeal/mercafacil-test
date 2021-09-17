import jsonwebtoken, { SignOptions } from 'jsonwebtoken';

import { TokenGenerator } from '@src/modules/client/signin/ports';
import { ENV } from '@src/infra/config/env';

const secret =
  ENV.NODE_ENV === 'test' ? 'jest_any_secret' : (ENV.PRIVATE_KEY as string);

const baseOptions = { issuer: 'Mercafacil Backend API Test', expiresIn: '1h' };

const options: SignOptions =
  ENV.NODE_ENV === 'test'
    ? { ...baseOptions }
    : { ...baseOptions, algorithm: 'HS256' };

export class JsonWebTokenAdapter implements TokenGenerator {
  generate(payload: any): string {
    return jsonwebtoken.sign(payload, secret, options);
  }
}
