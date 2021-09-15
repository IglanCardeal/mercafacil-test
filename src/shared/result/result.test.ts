/* eslint-disable @typescript-eslint/no-unused-vars */
import { Result } from './result';

class TestClass {
  public async execute (obj: any): Promise<Result<TestClass>> {
    return Result.ok<TestClass>(new TestClass());
  }
}

const makeTest = () => new TestClass();
const makeExecuteSpy = (testClass: TestClass) => {
  jest.spyOn(testClass, 'execute').mockImplementationOnce(
    async (obj: any): Promise<Result<TestClass>> => {
      return Result.fail<TestClass>('its fail');
    }
  );
};

describe('Result Shared Class', () => {
  it('Should return isFailure true if occurred a failure', async () => {
    const testClass = makeTest();
    makeExecuteSpy(testClass);
    const result: Result<TestClass> = await testClass.execute({});
    expect(result.isFailure).toBe(true);
  });

  it('Should return "its fail" if occurred a failure', async () => {
    const testClass = makeTest();
    makeExecuteSpy(testClass);
    const result: Result<TestClass> = await testClass.execute({});
    expect(result.error).toBe('its fail');
  });

  it('Should return isSuccess false if occurred a failure', async () => {
    const testClass = makeTest();
    makeExecuteSpy(testClass);
    const result: Result<TestClass> = await testClass.execute({});
    expect(result.isSuccess).toBe(false);
  });

  it('Should throw if occurred a failure', async () => {
    const testClass = makeTest();
    makeExecuteSpy(testClass);
    const result: Result<TestClass> = await testClass.execute({});
    expect(() => result.getValue()).toThrow(
      new Error('Cant retrieve the value from a failed result.')
    );
  });

  it('Should return isFailure fale if success', async () => {
    const testClass = makeTest();
    const result: Result<TestClass> = await testClass.execute({});
    expect(result.isFailure).toBe(false);
  });

  it('Should return empty error string if success', async () => {
    const testClass = makeTest();
    const result: Result<TestClass> = await testClass.execute({});
    expect(result.error).toBeFalsy();
  });

  it('Should return isSuccess true if success', async () => {
    const testClass = makeTest();
    const result: Result<TestClass> = await testClass.execute({});
    expect(result.isSuccess).toBe(true);
  });

  it('Should return TestClass instance if success', async () => {
    const testClass = makeTest();
    const result: Result<TestClass> = await testClass.execute({});
    expect(result.getValue()).toBeInstanceOf(TestClass);
  });

  it('Should Result throw if isSuccess and error are truthy', async () => {
    expect(() => new Result(true, 'any error')).toThrow(
      new Error(
        'InvalidOperation: A result cannot be successful and contain an error'
      )
    );
  });

  it('Should Result throw if isSuccess and error are falsy', async () => {
    expect(() => new Result(false, '')).toThrow(
      new Error(
        'InvalidOperation: A failing result needs to contain an error message'
      )
    );
  });
});
