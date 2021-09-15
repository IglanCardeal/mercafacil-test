export class MissingParamError extends Error {
  constructor (param: string) {
    super();
    this.message = `Missing param: ${param}`;
    this.name = 'MissingParamError';
  }
}