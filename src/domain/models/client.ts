export enum ClientTypes {
  'varejao' = 'varejao',
  'macapa' = 'macapa'
}

export interface Client {
  id: string,
  key: string,
  name: string,
  type: ClientTypes,
  password: string;
  email: string;
}