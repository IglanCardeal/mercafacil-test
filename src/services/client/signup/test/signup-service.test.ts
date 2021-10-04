/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '@src/domain/models/client';
import { Result } from '@src/shared/result/result';
import { ClientSignUpDTO } from '../client-signup-dto';
import { ClientSignUpRepository, Encrypter, UUIDGenerator } from '../ports';
import { SignUpService } from '../signup-service';

const clientData: Client = {
  name: 'any name',
  email: 'any@email.com',
  password: 'hashed_password',
  type: 'macapa',
  id: 'any_id',
  uuid: 'generated key',
};

class ClientSignUpRepositoryStub implements ClientSignUpRepository {
  public macapa = {
    async findClientByEmail (email: string): Promise<Client | null> {
      return clientData;
    },

    async createClient (client: any): Promise<Client> {
      return {
        ...client,
        id: 'any_id',
      };
    },
  };

  public varejao = {
    async findClientByEmail (email: string): Promise<Client | null> {
      return {
        ...clientData,
        type: 'varejao',
      };
    },

    async createClient (client: any): Promise<Client> {
      return {
        ...client,
        id: 'any_id',
      };
    },
  };
}

class EncrypterStub implements Encrypter {
  async encrypt (value: any): Promise<string> {
    return 'hashed_password';
  }
}

class UUIDGeneratorStub implements UUIDGenerator {
  generate (): string {
    return 'generated key';
  }
}

const makeMacapaBody = (): ClientSignUpDTO => ({
  name: 'any name',
  email: 'any@email.com',
  password: 'any_pass',
  type: 'macapa',
});

const sutFactory = () => {
  const clientSignUpRepositoryStub = new ClientSignUpRepositoryStub();
  const encrypterStub = new EncrypterStub();
  const uuidGeneratorStub = new UUIDGeneratorStub();
  return {
    sut: new SignUpService(
      clientSignUpRepositoryStub,
      encrypterStub,
      uuidGeneratorStub
    ),
    clientSignUpRepositoryStub,
    encrypterStub,
    uuidGeneratorStub,
  };
};

describe('Client SignUp Service', () => {
  it('Should return an error if the type of client is not allowed', async () => {
    const { sut } = sutFactory();
    const response: Result<any> = await sut.execute({
      ...makeMacapaBody(),
      type: 'incorrect type' as any,
    });
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      `Invalid client type: incorrect type. Must be "varejao" or "macapa"`
    );
  });

  it('Should an throw if the repository does not exist for the type of client', async () => {
    const { sut, clientSignUpRepositoryStub } = sutFactory();
    clientSignUpRepositoryStub.macapa = {} as any;
    await expect(sut.execute(makeMacapaBody())).rejects.toThrowError(
      `Client repository not found for type: ${makeMacapaBody().type}`
    );
  });

  it('Should return an error if the email already exist', async () => {
    const { sut } = sutFactory();
    const response: Result<any> = await sut.execute(makeMacapaBody());
    expect(response.isFailure).toBe(true);
  });

  it('Should return "macapa" client data correctly when signup success', async () => {
    const { sut, clientSignUpRepositoryStub } = sutFactory();
    jest
      .spyOn(clientSignUpRepositoryStub.macapa, 'findClientByEmail')
      .mockResolvedValueOnce(null);
    const response: Result<any> = await sut.execute(makeMacapaBody());
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()).toEqual(clientData);
  });

  it('Should return "varejao" client data correctly when signup success', async () => {
    const { sut, clientSignUpRepositoryStub } = sutFactory();
    jest
      .spyOn(clientSignUpRepositoryStub.varejao, 'findClientByEmail')
      .mockResolvedValueOnce(null);
    const response: Result<any> = await sut.execute({
      ...makeMacapaBody(),
      type: 'varejao',
    });
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()).toEqual({
      ...clientData,
      type: 'varejao',
    });
  });
});
