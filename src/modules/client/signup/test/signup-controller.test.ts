import { SignUpController } from "../signup-controller";

const sutFactory = () => {
  return { sut: new SignUpController() };
};

describe('Client SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: '',
        type: 'varejao',
        password: 'any_pass'
      }
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Missing param: name');
  });

  it('Should return 400 if no type is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: '',
        password: 'any_pass'
      }
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Missing param: type');
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: 'varejao',
        password: ''
      }
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Missing param: password');
  });

  it('Should return 400 if the type of client is not allowed', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        name: 'any name',
        type: 'vareja',
        password: 'any_pass'
      }
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(`Invalid client type: ${request.body.type}. Must be "varejao" or "macapa"`);
  });
});