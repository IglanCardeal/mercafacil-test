import { ClientSignInService } from '@src/domain/services/client';
import {
  DomainError,
  InvalidParamError,
  MissingParamError,
} from '@src/shared/errors';
import { badRequest, internalServerError, ok } from '@src/shared/http';
import { Result } from '@src/shared/result/result';
import { SignInController } from '../signin-controller';

class SignInServiceStub implements ClientSignInService {
  async execute (data: any): Promise<any> {
    return Result.ok<any>({
      uuid: 'unique_key',
      id: 'unique_id',
      ...data,
      token: 'any_token',
    });
  }
}

const makeRequest = () => ({
  body: {
    type: 'varejao',
    password: 'any_pass',
    email: 'any@email.com',
  },
});

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
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        password: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should return 400 if no email is provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        email: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no email is invalid', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        email: 'invalidemail.com',
      },
    });
    expect(response).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Should return 400 if no email was found', async () => {
    const { sut, signInServiceStub } = sutFactory();
    jest
      .spyOn(signInServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail('Invalid param: email or password is incorrect');
      });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(
      badRequest(
        new DomainError('Invalid param: email or password is incorrect')
      )
    );
  });

  it('Should return 500 if singin service throws', async () => {
    const { sut, signInServiceStub } = sutFactory();
    jest
      .spyOn(signInServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(internalServerError());
  });

  it('Should return 200 if singin success', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(ok({ token: 'any_token' }));
  });
});
