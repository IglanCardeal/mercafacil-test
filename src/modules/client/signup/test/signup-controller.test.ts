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
});