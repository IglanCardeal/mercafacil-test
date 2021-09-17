import jsonwebtoken, { SignOptions } from 'jsonwebtoken';

import { TokenGenerator } from '@src/modules/client/signin/ports';
import { ENV } from '@src/infra/config/env';

const baseOptions = { issuer: 'Mercafacil Backend API Test', expiresIn: '1h' };

const options: SignOptions = { ...baseOptions, algorithm: 'RS256' };

export class JsonWebTokenAdapter implements TokenGenerator {
  generate(payload: any): string {
    return jsonwebtoken.sign(payload, ENV.PRIVATE_KEY as string, options);
  }
}
