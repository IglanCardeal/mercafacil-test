export interface ClientSignInService {
  execute: (data: any) => Promise<any>;
}

export interface ClientSignUpService {
  execute: (data: any) => Promise<any>;
}
