/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '@src/domain/models/client';
import { Result } from '@src/shared/result/result';
import { ClientSignUpDTO } from '../client-signup-dto';
import { ClientSignUpRepository, Encrypter, UUIDGenerator } from '../ports';
import { SignUpService } from '../signup-service';

class ClientSignUpRepositoryStub implements ClientSignUpRepository {
  public macapa = {
    async findClientByEmail(email: string): Promise<Client | null> {
      return {
        name: 'any name',
        email: 'any@email.com',
        password: 'any_pass',
        type: 'macapa',
        id: 'any_id',
        uuid: 'any_key',
      };
    },

    async createClient(client: any): Promise<Client> {
      return {
        ...client,
        id: 'any_id',
      };
    },
  };

  public varejao = {
    async findClientByEmail(email: string): Promise<Client | null> {
      return {
        name: 'any name',
        email: 'any@email.com',
        password: 'any_pass',
        type: 'varejao',
        id: 'any_id',
        uuid: 'any_key',
      };
    },

    async createClient(client: any): Promise<Client> {
      return {
        ...client,
        id: 'any_id',
      };
    },
  };
}

class EncrypterStub implements Encrypter {
  async encrypt(value: any): Promise<string> {
    return 'hashed_password';
  }
}

class UUIDGeneratorStub implements UUIDGenerator {
  generate(): string {
    return 'generated key';
  }
}

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
    const clientData: ClientSignUpDTO = {
      name: 'any name',
      email: 'any@email.com',
      password: 'any_pass',
      type: 'incorrect type' as any,
    };
    const response: Result<any> = await sut.execute(clientData);
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      `Invalid client type: ${clientData.type}. Must be "varejao" or "macapa"`
    );
  });

  it('Should an throw if the repository does not exist for the type of client', async () => {
    const clientSignUpRepositoryStub = new ClientSignUpRepositoryStub();
    const { encrypterStub, uuidGeneratorStub } = sutFactory();
    clientSignUpRepositoryStub.macapa = {} as any;
    const sut = new SignUpService(
      clientSignUpRepositoryStub,
      encrypterStub,
      uuidGeneratorStub
    );
    const clientData: ClientSignUpDTO = {
      name: 'any name',
      email: 'any@email.com',
      password: 'any_pass',
      type: 'macapa',
    };
    await expect(sut.execute(clientData)).rejects.toThrowError(
      `Client repository not found for type: ${clientData.type}`
    );
  });

  it('Should return an error if the email already exist', async () => {
    const { sut } = sutFactory();
    const clientData: ClientSignUpDTO = {
      name: 'any name',
      email: 'any@email.com',
      password: 'any_pass',
      type: 'macapa',
    };
    const response: Result<any> = await sut.execute(clientData);
    expect(response.isFailure).toBe(true);
  });

  it('Should return "macapa" client data correctly when signup success', async () => {
    const { sut, clientSignUpRepositoryStub } = sutFactory();
    jest
      .spyOn(clientSignUpRepositoryStub.macapa, 'findClientByEmail')
      .mockResolvedValueOnce(null);
    const clientData: ClientSignUpDTO = {
      name: 'any name',
      email: 'any@email.com',
      password: 'any_pass',
      type: 'macapa',
    };
    const response: Result<any> = await sut.execute(clientData);
    expect(response.isFailure).toBe(false);
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()).toEqual({
      name: 'any name',
      email: 'any@email.com',
      password: 'hashed_password',
      type: 'macapa',
      id: 'any_id',
      key: 'generated key',
    });
  });

  it('Should return "varejao" client data correctly when signup success', async () => {
    const { sut, clientSignUpRepositoryStub } = sutFactory();
    jest
      .spyOn(clientSignUpRepositoryStub.varejao, 'findClientByEmail')
      .mockResolvedValueOnce(null);
    const clientData: ClientSignUpDTO = {
      name: 'any name',
      email: 'any@email.com',
      password: 'any_pass',
      type: 'varejao',
    };
    const response: Result<any> = await sut.execute(clientData);
    expect(response.isFailure).toBe(false);
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()).toEqual({
      name: 'any name',
      email: 'any@email.com',
      password: 'hashed_password',
      type: 'varejao',
      id: 'any_id',
      key: 'generated key',
    });
  });
});
