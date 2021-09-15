export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: string;
  private _value: T;

  constructor (isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error'
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message'
      );
    }
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error as string;
    this._value = value as T;
    Object.freeze(this);
  }

  public getValue (): T {
    if (this.isFailure) {
      throw new Error('Cant retrieve the value from a failed result.');
    }
    return this._value;
  }

  public static ok<U> (value?: U): Result<U> {
    return new Result(true, '', value);
  }

  public static fail<U> (error: string): Result<U> {
    return new Result(false, error);
  }
}
