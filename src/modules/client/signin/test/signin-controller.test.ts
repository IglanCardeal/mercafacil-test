import { SignInController } from '../signin-controller';

const sutFactory = () => {
  return {
    sut: new SignInController(),
  };
};

describe('Client SignIn Controller', () => {
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

  // it('Should return 400 if no email is provided', async () => {
  //   const { sut } = sutFactory();
  //   const request = {
  //     body: {
  //       name: 'any name',
  //       type: 'varejao',
  //       password: 'any_pass',
  //       email: '',
  //     },
  //   };
  //   const response = await sut.handle(request);
  //   expect(response.statusCode).toBe(400);
  //   expect(response.body.error).toBe('Missing param: email');
  // });
});
