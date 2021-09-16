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
    async findClientByEmailAndType(email: string): Promise<Client | null> {
      return {
        name: 'any name',
        email: 'any@email.com',
        password: 'any_pass',
        type: 'macapa',
        id: 'any_id',
        key: 'any_key',
      };
    },
  };

  public varejao = {
    async findClientByEmailAndType(email: string): Promise<Client | null> {
      return {
        name: 'any name',
        email: 'any@email.com',
        password: 'any_pass',
        type: 'varejao',
        id: 'any_id',
        key: 'any_key',
      };
    },
  };
}

class PasswordCompareStub implements PasswordCompare {
  async compare(password: string, hash: string): Promise<boolean> {
    return true;
  }
}

class TokenGeneratorStub implements TokenGenerator {
  generate(payload: string): string {
    return 'generated_token';
  }
}

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
  it('Should throw if the repository does not exist for the client type', async () => {
    const { sut, signInRepositoryStub } = sutFactory();
    signInRepositoryStub.macapa = {} as any;
    const clientData: ClientSignInDTO = {
      email: 'ane@email.com',
      password: 'any_pass',
      type: 'macapa',
    };
    await expect(sut.execute(clientData)).rejects.toThrowError(
      `Client repository not found for type: ${clientData.type}`
    );
  });

  it('Should return failure when email was not found', async () => {
    const { sut, signInRepositoryStub } = sutFactory();
    jest
      .spyOn(signInRepositoryStub.macapa, 'findClientByEmailAndType')
      .mockResolvedValueOnce(null);
    const clientData: ClientSignInDTO = {
      email: 'ane@email.com',
      password: 'any_pass',
      type: 'macapa',
    };
    const response: Result<Client> = await sut.execute(clientData);
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      'Invalid param: email or password is incorrect'
    );
  });

  it('Should return failure when password does not match', async () => {
    const { sut, passwordCompareStub } = sutFactory();
    const clientData: ClientSignInDTO = {
      email: 'ane@email.com',
      password: 'any_pass',
      type: 'macapa',
    };
    jest.spyOn(passwordCompareStub, 'compare').mockResolvedValueOnce(false);
    const response: Result<Client> = await sut.execute(clientData);
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      'Invalid param: email or password is incorrect'
    );
  });

  it('Should return client token when signin succcess', async () => {
    const { sut } = sutFactory();
    const clientData: ClientSignInDTO = {
      email: 'ane@email.com',
      password: 'any_pass',
      type: 'macapa',
    };
    const response: Result<Client> = await sut.execute(clientData);
    expect(response.isFailure).toBe(false);
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()).toEqual({ token: 'generated_token' });
  });
});
