/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '@src/domain/models/client';
import { Result } from '@src/shared/result/result';
import { ClientSignInDTO } from '../client-signin-dto';
import {
  ClientSignInRepository,
  PasswordCompare,
  TokenGenerator,
} from '../ports';
import { SignInService } from '../singin-service';

class SignInRepositoryStub implements ClientSignInRepository {
  public macapa = {
    async findClientByEmail (email: string): Promise<Client | null> {
      return {
        name: 'any name',
        email: 'any@email.com',
        password: 'any_pass',
        type: 'macapa',
        id: 'any_id',
        uuid: 'any_key',
      };
    },
  };

  public varejao = {
    async findClientByEmail (email: string): Promise<Client | null> {
      return {
        name: 'any name',
        email: 'any@email.com',
        password: 'any_pass',
        type: 'varejao',
        id: 'any_id',
        uuid: 'any_key',
      };
    },
  };
}

class PasswordCompareStub implements PasswordCompare {
  async compare (password: string, hash: string): Promise<boolean> {
    return true;
  }
}

class TokenGeneratorStub implements TokenGenerator {
  generate (payload: string): string {
    return 'generated_token';
  }
}

const makeBody = (): ClientSignInDTO => ({
  email: 'ane@email.com',
  password: 'any_pass',
  type: 'macapa',
});

const sutFactory = () => {
  const signInRepositoryStub = new SignInRepositoryStub();
  const passwordCompareStub = new PasswordCompareStub();
  const tokenGeneratorStub = new TokenGeneratorStub();
  return {
    sut: new SignInService(
      signInRepositoryStub,
      passwordCompareStub,
      tokenGeneratorStub
    ),
    signInRepositoryStub,
    passwordCompareStub,
    tokenGeneratorStub,
  };
};

describe('Client SignIn Service', () => {
  it('Should return an error if the type of client is not allowed', async () => {
    const { sut } = sutFactory();
    const response: Result<any> = await sut.execute({
      ...makeBody(),
      type: 'incorrect type' as any,
    });
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      `Invalid client type: incorrect type. Must be "varejao" or "macapa"`
    );
  });

  it('Should throw if the repository does not exist for the client type', async () => {
    const { sut, signInRepositoryStub } = sutFactory();
    signInRepositoryStub.macapa = {} as any;
    await expect(sut.execute(makeBody())).rejects.toThrowError(
      `Client repository not found for type: ${makeBody().type}`
    );
  });

  it('Should return failure when email was not found', async () => {
    const { sut, signInRepositoryStub } = sutFactory();
    jest
      .spyOn(signInRepositoryStub.macapa, 'findClientByEmail')
      .mockResolvedValueOnce(null);
    const response: Result<Client> = await sut.execute(makeBody());
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      'Invalid param: email or password is incorrect'
    );
  });

  it('Should return failure when password does not match', async () => {
    const { sut, passwordCompareStub } = sutFactory();
    jest.spyOn(passwordCompareStub, 'compare').mockResolvedValueOnce(false);
    const response: Result<Client> = await sut.execute(makeBody());
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      'Invalid param: email or password is incorrect'
    );
  });

  it('Should return client token when signin succcess', async () => {
    const { sut } = sutFactory();
    const response: Result<Client> = await sut.execute(makeBody());
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()).toEqual({ token: 'Bearer generated_token' });
  });
});
