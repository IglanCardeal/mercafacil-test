import { clientTypesArray } from '@src/domain/models/client';
import { CreateContactDTO } from '../create-contact-dto';
import { CreateService } from '../create-service';

const sutFactory = () => {
  return {
    sut: new CreateService(clientTypesArray),
  };
};

describe('Create Contact Service', () => {
  it('Should return failure when client type is not allowed', async () => {
    const { sut } = sutFactory();
    const data: CreateContactDTO = {
      contacts: [{ name: 'Any Name', cellphone: '5541999999999' }],
      key: 'unique_key',
      type: 'invalid' as any,
    };
    const response = await sut.execute(data);
    expect(response.isFailure).toBe(true);
  });
});
