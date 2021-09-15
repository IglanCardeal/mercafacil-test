export enum ClientType {
  'varejao' = 'varejao',
  'macapa' = 'macapa'
}

export interface Client {
  id: string,
  key: string,
  name: string,
  type: ClientType,
  password: string;
  email: string;
}