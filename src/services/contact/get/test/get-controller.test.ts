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
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
  });
});
