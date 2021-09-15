/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignUpService } from '@src/domain/services/signup-service';
import { Result } from '@src/shared/result/result';
import { SignUpController } from '../signup-controller';

class SignUpServiceStub implements SignUpService {
  async execute(_data: any): Promise<any> {
    return Result.ok({ key: 'unique_key' });
  }
}

const sutFactory = () => {
  const signupService = new SignUpServiceStub();
  return { sut: new SignUpController(signupService), signupService };
};

describe('Client SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: '',
        type: 'varejao',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: name');
  });

  it('Should return 400 if no type is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: '',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: type');
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: 'varejao',
        password: '',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: password');
  });

  it('Should return 400 if no email is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: 'varejao',
        password: 'any_pass',
        email: '',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: email');
  });

  it('Should return 400 if no email is invalid', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: 'varejao',
        password: 'any_pass',
        email: 'anyemail.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid param: email');
  });

  it('Should return 400 if the type of client is not allowed', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: 'vareja',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      `Invalid client type: ${request.body.type}. Must be "varejao" or "macapa"`
    );
  });

  it('Should return 400 when signup service returns a failure', async () => {
    const { sut, signupService } = sutFactory();
    jest
      .spyOn(signupService, 'execute')
      .mockResolvedValueOnce(Result.fail('Random domain error'));
    const request = {
      body: {
        name: 'any name',
        type: 'varejao',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Random domain error');
  });
});
