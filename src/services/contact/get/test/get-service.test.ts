import { GetContacts } from '../get-service';
import { GetContactsDTO } from '../ports';

const sutFactory = () => {
  return {
    sut: new GetContacts(),
  };
};

describe('Get Client Contacts', () => {
  it('Should return failure when client type is not allowed', async () => {
    const { sut } = sutFactory();
    const data: GetContactsDTO = {
      key: 'unique_key',
      type: 'macapas' as any,
    };
    const response = await sut.execute(data);
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      `Invalid client type: ${data.type}. Must be "varejao" or "macapa"`
    );
  });
});
