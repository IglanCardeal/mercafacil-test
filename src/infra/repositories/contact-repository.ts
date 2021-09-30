import { CreateContactRepository } from '@src/repositories/contact-repository';
import { GetContactsRepository } from '@src/services/contact/get/ports';
import { CsvContactRepository } from './csv/contact-csv-repository';
import { SequelizeContactRepository } from './database/contact-db-repository';

export class ContactRepository
  implements CreateContactRepository, GetContactsRepository {
  public varejao: any;
  public macapa: any;

  constructor () {
    this.varejao = new SequelizeContactRepository().varejao;
    this.macapa = new CsvContactRepository().macapa;
  }
}
