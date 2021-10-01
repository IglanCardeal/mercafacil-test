// src/infra/repositories/contact-repository.ts
import {
  CreateContactRepository,
  GetContactsRepository,
} from '@src/repositories/contact-repository';
import { CsvContactRepository } from './csv/contact-csv-repository';
import { SequelizeContactRepository } from './database/contact-db-repository';

export class ContactRepository
  implements CreateContactRepository, GetContactsRepository {
  constructor (
    public varejao = new SequelizeContactRepository().varejao,
    public macapa = new CsvContactRepository().macapa
  ) {}
}
