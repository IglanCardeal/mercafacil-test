import { ClientSignUpService } from '@src/domain/services/client';
import {
  DomainError,
  InvalidParamError,
  MissingParamError,
} from '@src/shared/errors';
import { badRequest, created, internalServerError } from '@src/shared/http';
import { Result } from '@src/shared/result/result';
import { SignUpController } from '../signup-controller';

class SignUpServiceStub implements ClientSignUpService {
  async execute (data: any): Promise<any> {
    return Result.ok<any>({ uuid: 'unique_key', id: 'unique_id', ...data });
  }
}

const makeRequest = () => ({
  body: {
    name: 'any name',
    type: 'varejao',
    password: 'any_pass',
    email: 'any@email.com',
  },
});

const sutFactory = () => {
  const signupService = new SignUpServiceStub();
  return { sut: new SignUpController(signupService), signupService };
};

describe('Client SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        name: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('name')));
  });

  it('Should return 400 if no type is provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        type: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('type')));
  });

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

  it('Should call signup service with correct values', async () => {
    const { sut, signupService } = sutFactory();
    const signupServiceSpy = jest.spyOn(signupService, 'execute');
    await sut.handle(makeRequest());
    expect(signupServiceSpy).toHaveBeenCalledWith(makeRequest().body);
  });

  it('Should return 400 when signup service returns a failure', async () => {
    const { sut, signupService } = sutFactory();
    jest
      .spyOn(signupService, 'execute')
      .mockResolvedValueOnce(Result.fail('Random domain error'));
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(
      badRequest(new DomainError('Random domain error'))
    );
  });

  it('Should return 500 if signup service throws exception', async () => {
    const { sut, signupService } = sutFactory();
    jest.spyOn(signupService, 'execute').mockImplementationOnce(async () => {
      throw new Error();
    });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(internalServerError());
  });

  it('Should return 201 with correct client data when signup success', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(
      created({
        ...makeRequest().body,
        uuid: 'unique_key',
        id: 'unique_id',
      })
    );
  });
});
