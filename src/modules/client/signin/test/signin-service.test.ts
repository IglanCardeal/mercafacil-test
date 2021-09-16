/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '@src/domain/models/client';
import { Result } from '@src/shared/result/result';
import { ClientSignInDTO } from '../client-signin-dto';
import { ClientSignInRepository } from '../ports';
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

const sutFactory = () => {
  const signInRepositoryStub = new SignInRepositoryStub();
  return {
    sut: new SignInService(signInRepositoryStub),
    signInRepositoryStub,
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
});
