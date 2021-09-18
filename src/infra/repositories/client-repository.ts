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
    findClientByEmail: async (clientEmail: string): Promise<Client | null> => {
      const client = await VarejaoClient.findOne({
        where: { email: clientEmail },
      });
      if (!client) {
        return null;
      }
      const { id, uuid, name, email, type, password } = client;
      return { id, uuid, name, email, type, password };
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

    findClientByKey: async (key: string): Promise<Client | null> => {
      const client = await VarejaoClient.findOne({
        where: { uuid: key },
      });
      if (!client) {
        return null;
      }
      const { id, uuid, name, email, type, password } = client;
      return { id, uuid, name, email, type, password };
    },
  };

  public macapa = {
    findClientByEmail: async (clientEmail: string): Promise<Client | null> => {
      const client = await MacapaClient.findOne({
        where: { email: clientEmail },
      });
      if (!client) {
        return null;
      }
      const { id, uuid, name, email, type, password } = client;
      return { id, uuid, name, email, type, password };
    },

    createClient: async (client: any): Promise<Client> => {
      const clientCreated = await MacapaClient.create({
        uuid: client.uuid,
        name: client.name,
        type: client.type,
        password: client.password,
        email: client.email,
      });

      return { ...client, id: clientCreated.id };
    },

    findClientByKey: async (key: string): Promise<Client | null> => {
      const client = await MacapaClient.findOne({
        where: { uuid: key },
      });
      if (!client) {
        return null;
      }
      const { id, uuid, name, email, type, password } = client;
      return { id, uuid, name, email, type, password };
    },
  };
}
