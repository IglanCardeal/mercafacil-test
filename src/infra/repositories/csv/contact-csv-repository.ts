import * as csv from 'fast-csv';
import { createWriteStream, createReadStream, existsSync } from 'fs';
import path from 'path';

import { Contact } from '@src/domain/models/contact';
import { CreateContactRepository } from '@src/repositories/contact-repository';
import { GetContactsRepository } from '@src/services/contact/get/ports';
import { UuidAdapter } from '../../adapters/uuidv4/uuid-adapter';

const PATH_TO_CSV_FILE = path.join(__dirname, 'store', 'macapa-contacts.csv');

export class CsvContactRepository
  implements Partial<CreateContactRepository>, Partial<GetContactsRepository> {
  public macapa = {
    createContact: async (
      contacts: Omit<Contact, 'id'>[]
    ): Promise<Contact[]> => {
      contacts;
      const csvAlreadyExist = existsSync(PATH_TO_CSV_FILE);
      const shouldUseHeaders = csvAlreadyExist ? false : true;
      const tabDelimiter = '\t';
      const csvStream = csv.format({
        headers: shouldUseHeaders,
        delimiter: tabDelimiter,
        includeEndRowDelimiter: true,
      });

      csvStream.pipe(createWriteStream(PATH_TO_CSV_FILE, { flags: 'a' }));
      const contactsWithUuid = this.generateUuidForContacts(contacts);
      for (const contact of contactsWithUuid) {
        csvStream.write(contact);
      }
      csvStream.end();

      return contactsWithUuid;
    },

    getContacts: async (): Promise<Contact[]> => {
      const tabDelimiter = '\t';
      const csvAlreadyExist = existsSync(PATH_TO_CSV_FILE);
      if (!csvAlreadyExist) return [];
      const contacts: Contact[] = [];
      const csvStreamRead = createReadStream(PATH_TO_CSV_FILE);

      return new Promise((resolve, reject) => {
        csvStreamRead
          .pipe(csv.parse({ headers: true, delimiter: tabDelimiter }))
          .on('data', (contact: Contact) => {
            contacts.push(contact);
          })
          .on('error', () => {
            reject('Unable to retrieve contacts from CSV file');
          })
          .on('end', () => {
            resolve(contacts);
          });
      });
    },
  };

  private generateUuidForContacts (contacts: Omit<Contact, 'id'>[]): Contact[] {
    return contacts.map(contact => ({
      id: new UuidAdapter().generate(),
      ...contact,
    }));
  }
}
