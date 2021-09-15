export class MissingParamError extends Error {
  constructor (param: string) {
    super();
    this.message = `Missing param: ${param}`;
    this.name = 'MissingParamError';
  }
}

export class DomainError extends Error {
  constructor (msg: string) {
    super();
    this.message = msg;
    this.name = 'DomainError';
  }
}

export class InvalidParamError extends Error {
  constructor (param: string) {
    super();
    this.message = `Invalid param: ${param}`;
    this.name = 'InvalidParamError';
  }
}