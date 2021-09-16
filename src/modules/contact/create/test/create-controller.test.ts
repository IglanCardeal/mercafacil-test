import { CreateController } from '../create-controller';

const sutFactory = () => {
  return {
    sut: new CreateController(),
  };
};

describe('Create Contact Controller', () => {
  it('Should return 400 when no contacts is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        contacts: '',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: contacts');
  });

  it('Should return 400 when contacts is not an array', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        contacts: {},
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'Invalid param: contacts must be an array'
    );
  });
});
