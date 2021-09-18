/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from '@src/domain/models/client';
import {
  ClientSignInRepository,
  ClientSignUpRepository,
} from '@src/repositories/client-repository';
import { MacapaClient, VarejaoClient } from '../models/client-model';

export class SequelizeClientRepository
  implements ClientSignUpRepository, ClientSignInRepository
{
  public varejao = {
    findClientByEmail: async (email: string): Promise<Client | null> => {
      const client = await VarejaoClient.findOne({ where: { email } });
      return client;
    },

    createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
      const clientCreated = await VarejaoClient.create({
        uuid: client.uuid,
        name: client.name,
        type: client.type,
        password: client.password,
        email: client.email,
      });
      return clientCreated;
    },
  };

  public macapa = {
    findClientByEmail: async (email: string): Promise<Client | null> => {
      const client = await MacapaClient.findOne({ where: { email } });
      return client;
    },

    createClient: async (client: any): Promise<Client> => {
      const clientCreated = await MacapaClient.create({
        uuid: client.uuid,
        name: client.name,
        type: client.type,
        password: client.password,
        email: client.email,
      });

      return { ...client, id: clientCreated._attributes.id };
    },
  };
}