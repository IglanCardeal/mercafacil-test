import uuid from 'uuid';
import { UuidAdapter } from './uuid-adapter';

jest.mock('uuid', () => {
  return {
    v4: () => 'generated_id',
  };
});
describe('UuidAdapter Adapter', () => {
  it('should call uuidv4', () => {
    const uuidv4Spy = jest.spyOn(uuid, 'v4');
    new UuidAdapter().generate();
    expect(uuidv4Spy).toHaveBeenCalled();
  });

  it('should return a generated id', () => {
    const id = new UuidAdapter().generate();
    expect(id).toBeDefined();
    expect(id).toBe('generated_id');
  });
});
