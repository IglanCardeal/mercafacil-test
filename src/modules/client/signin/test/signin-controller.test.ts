import { ClientSignInService } from '@src/domain/services/client';
import { Result } from '@src/shared/result/result';
import { SignInController } from '../signin-controller';

class SignInServiceStub implements ClientSignInService {
  async execute(data: any): Promise<any> {
    return Result.ok<any>({ key: 'unique_key', id: 'unique_id', ...data });
  }
}

const sutFactory = () => {
  const signInServiceStub = new SignInServiceStub();
  return {
    sut: new SignInController(signInServiceStub),
    signInServiceStub,
  };
};

describe('Client SignIn Controller', () => {
  it('Should return 400 if no password is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
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
        type: 'varejao',
        password: 'any_pass',
        email: 'anyemail.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid param: email');
  });

  it('Should return 400 if no email was found', async () => {
    const { sut, signInServiceStub } = sutFactory();
    jest
      .spyOn(signInServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail('Invalid param: email or password is incorrect');
      });
    const request = {
      body: {
        type: 'varejao',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'Invalid param: email or password is incorrect'
    );
  });

  it('Should return 500 if singin service throws', async () => {
    const { sut, signInServiceStub } = sutFactory();
    jest
      .spyOn(signInServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const request = {
      body: {
        type: 'varejao',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });

  it('Should return 200 if singin success', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        type: 'varejao',
        password: 'any_pass',
        email: 'any@email.com',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });
  });
});
