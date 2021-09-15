export enum ClientType {
  'varejao' = 'varejao',
  'macapa' = 'macapa'
}

export interface Client {
  id: string,
  name: string,
  key: string,
  type: ClientType,
  password: string;
}