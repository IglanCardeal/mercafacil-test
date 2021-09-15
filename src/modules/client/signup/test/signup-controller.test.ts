import { ClientSignUpService } from '@src/domain/services/client-signup-service';
import { Result } from '@src/shared/result/result';
import { SignUpController } from '../signup-controller';

class SignUpServiceStub implements ClientSignUpService {
  async execute(data: any): Promise<any> {
    return Result.ok<any>({ key: 'unique_key', id: 'unique_id', ...data });
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

  it('Should call signup service with correct values', async () => {
    const { sut, signupService } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: 'varejao',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const signupServiceSpy = jest.spyOn(signupService, 'execute');
    await sut.handle(request);
    expect(signupServiceSpy).toHaveBeenCalledWith(request.body);
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

  it('Should return 500 if signup service throws exception', async () => {
    const { sut, signupService } = sutFactory();
    jest.spyOn(signupService, 'execute').mockImplementationOnce(async () => {
      throw new Error();
    });
    const request = {
      body: {
        name: 'any name',
        type: 'varejao',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });

  it('Should return 201 with correct client data when signup success', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: 'varejao',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      ...request.body,
      key: 'unique_key',
      id: 'unique_id',
    });
  });
});
