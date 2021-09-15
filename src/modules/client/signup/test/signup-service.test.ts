import { Result } from '@src/shared/result/result';
import { ClientDTO } from '../client-dto';
import { SignUpService } from '../signup-service';

const sutFactory = () => {
  return {
    sut: new SignUpService(),
  };
};

describe('Client SignUp Service', () => {
  it('Should return an error if the type of client is not allowed', async () => {
    const { sut } = sutFactory();
    const clientData: ClientDTO = {
      name: 'any name',
      email: 'any email',
      password: 'any_pass',
      type: 'incorrect type',
    };
    const response: Result<any> = await sut.execute(clientData);
    expect(response.isFailure).toBe(true);
  });
});
