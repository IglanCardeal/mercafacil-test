import { GetController } from '../get-controller';

const sutFactory = () => {
  return {
    sut: new GetController(),
  };
};

describe('Get Contact Controller', () => {
  it('Should return 400 when type is not provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        type: '',
        key: 'unique_key',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(`Missing param: type`);
  });

  it('Should return 400 when key is not provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        type: 'varejao',
        key: '',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(`Missing param: key`);
  });
});
