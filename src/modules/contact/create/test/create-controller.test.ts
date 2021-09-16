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

  it('Should return 400 when contact name is not provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        contacts: [
          {
            name: '',
            cellphone: '5541999999999',
          },
        ],
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: contact name');
  });

  it('Should return 400 when contact cellphone is not provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        contacts: [
          {
            name: 'Any Name',
            cellphone: '',
          },
        ],
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: contact cellphone');
  });
});
