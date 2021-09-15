export type ClientTypes = 'varejao' | 'macapa';

export const clientTypesArray = Object.freeze(['varejao', 'macapa']);

export interface Client {
  id: string;
  key: string;
  name: string;
  type: ClientTypes;
  password: string;
  email: string;
}
