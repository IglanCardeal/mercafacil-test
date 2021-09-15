/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, ClientTypes } from '@src/domain/models/client';
import { Result } from '@src/shared/result/result';
import { ClientDTO } from '../client-dto';
import { ClientSignUpRepository } from '../ports';
import { SignUpService } from '../signup-service';

class ClientSignUpRepositoryStub implements ClientSignUpRepository {
  async findClientByEmailAndType(
    email: string,
    clientType: string
  ): Promise<Client> {
    return {
      name: 'any name',
      email: 'any@email.com',
      password: 'any_pass',
      type: 'macapa',
      id: 'any_id',
      key: 'any_key',
    };
  }
}

const sutFactory = () => {
  const clientSignUpRepositoryStub = new ClientSignUpRepositoryStub();
  return {
    sut: new SignUpService(clientSignUpRepositoryStub),
    clientSignUpRepositoryStub,
  };
};

describe('Client SignUp Service', () => {
  it('Should return an error if the type of client is not allowed', async () => {
    const { sut } = sutFactory();
    const clientData: ClientDTO = {
      name: 'any name',
      email: 'any@email.com',
      password: 'any_pass',
      type: 'incorrect type',
    };
    const response: Result<any> = await sut.execute(clientData);
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      `Invalid client type: ${clientData.type}. Must be "varejao" or "macapa"`
    );
  });

  it.skip('Should return an error if the email already exist', async () => {
    const { sut } = sutFactory();
    const clientData: ClientDTO = {
      name: 'any name',
      email: 'any@email.com',
      password: 'any_pass',
      type: 'macapa',
    };
    const response: Result<any> = await sut.execute(clientData);
    expect(response.isFailure).toBe(true);
  });
});
