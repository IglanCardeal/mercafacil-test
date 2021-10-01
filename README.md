<div align="center">

# Back-end API

## Mercafacil Test

</div>

---

![1](https://img.shields.io/static/v1?label=tests&message=passing&color=green&style=flat) ![1](https://img.shields.io/static/v1?label=ci&message=passing&color=yellow&style=flat) ![1](https://img.shields.io/static/v1?label=yarn&message=v1.22.10&color=blue&style=flat) ![1](https://img.shields.io/static/v1?label=node&message=v16&color=darkgreen&style=flat) ![1](https://img.shields.io/static/v1?label=docker&message=v19.03.13&color=lightblue&style=flat) ![1](https://img.shields.io/static/v1?label=docker-compose&message=1.27.4&color=darkblue&style=flat) ![1](https://img.shields.io/static/v1?label=git&message=v2.25.1&color=red&style=flat) ![1](https://img.shields.io/static/v1?label=fastify&message=v3.21.3&color=white&style=flat)

# Status do Projeto

Concluído

Para a documentação oficial, consulte a branch [`main`](https://github.com/IglanCardeal/mercafacil-test/tree/main)

## Sobre esta branch `csv`

**Criei esta branch como uma prova de conceito**. Pelo fato de eu ter seguido uma estratégia mais voltada para arquitetura em camadas e seguindo os princípios SOLID na construção do sistema, facilitou eu aplicar uma mudança em uma parte específica do projeto sem afetar os outros componentes do sistema.

Imaginei uma situação hipotética em que fosse necessário adaptar parte do sistema para atender essa situação. Na situação hipotética, o cliente **Macapá** decidiu que os contatos não seriam mais salvos no banco MySQL. Ao invés disso, todos os contatos seriam salvos em um arquivo **CSV** e que essa mudança devesse ser aplicada o quanto antes.

Pelo fato de ter seguido uma abordagem de arquitetura em camadas, poucas partes do sistema teve que ser alterada. Somente a pasta de `infra` teve arquivos alterados. Como agora eu não iria mais usar MySQL para salvar contatos do cliente **Macapá**, eu resolvi criar duas pastas para deixar explicito que eu teria duas implementações de repositórios. Um chamado `CSV` e outro `database`.

Na hora de implementar as interfaces `CreateContactRepository` e `GetContactsRepository` em ambos os repositórios, usei o recurso do TypeScript chamado `Partial`, pois cada um iria implementar os objetos `macapa` e `varejao` separadamente.
Por exemplo na classe `CsvContactRepository`:

```js
export class CsvContactRepository
  implements Partial<CreateContactRepository>, Partial<GetContactsRepository> {
    ...
  }
```

E na hora de implementar a classe `ContactRepository` que será injetada na camada de serviço, usei composição de objetos e consegui respeitar a interface esperada pela camada de serviço:

```js
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
```

Tirando uma leve renomeação nas funções _factory_ na pasta `fastify`, este foi a única parte do sistema que precisou de modificação. Todo o restante do sistema se manteve intacto, mostrando os benefícios de se manter uma arquitetura de componentes desacoplada, seguindo os princípios SOLID.

Para realizar toda a lógica do arquivo **CSV** eu usei a biblioteca **`fast-csv`** e alguns módulos _built-in_ do **`fs`**.
Todo o código da implementação está abaixo para facilitar a consulta:

```js
import * as csv from 'fast-csv';
import { createWriteStream, createReadStream, existsSync, mkdirSync } from 'fs';
import path from 'path';

import { Contact } from '@src/domain/models/contact';
import { CreateContactRepository } from '@src/repositories/contact-repository';
import { GetContactsRepository } from '@src/services/contact/get/ports';
import { UuidAdapter } from '../../adapters/uuidv4/uuid-adapter';

const PATH_TO_CSV_FILE = path.join(__dirname, 'store', 'macapa-contacts.csv');
const PATH_TO_STORE_FOLDER = path.join(__dirname, 'store');

export class CsvContactRepository
  implements Partial<CreateContactRepository>, Partial<GetContactsRepository> {
  public macapa = {
    createContact: async (
      contacts: Omit<Contact, 'id'>[]
    ): Promise<Contact[]> => {
      const contactsWithUuid = this.generateUuidForContacts(contacts);
      const csvAlreadyExist = existsSync(PATH_TO_CSV_FILE);
      const storeFolderExist = existsSync(PATH_TO_STORE_FOLDER);

      if (!storeFolderExist) mkdirSync(PATH_TO_STORE_FOLDER);

      const shouldUseHeaders = !csvAlreadyExist;
      const tabDelimiter = '\t';
      const csvStream = csv.format({
        headers: shouldUseHeaders,
        delimiter: tabDelimiter,
        includeEndRowDelimiter: true,
      });

      csvStream.pipe(createWriteStream(PATH_TO_CSV_FILE, { flags: 'a' }));
      for (const contact of contactsWithUuid) {
        csvStream.write(contact);
      }
      csvStream.end();

      return contactsWithUuid;
    },

    getContacts: async (): Promise<Contact[]> => {
      const storeFolderExist = existsSync(path.join(__dirname, 'store'));
      const csvAlreadyExist = existsSync(PATH_TO_CSV_FILE) && storeFolderExist;

      if (!csvAlreadyExist) return [];

      const tabDelimiter = '\t';
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
```

## Sobre mim

Eu sou Iglan Cardeal, desenvolvedor Node.js, apaixonado por programação, café e aviação. Atualmente meus estudos e práticas estão focados mais em Node.js, mas estou estudando Python (menos do que gostaria) e em breve vou retornar meus estudos para React Native.

Estou na busca por desafios e resolvê-los através dos meus conhecimentos e teimosia. Procuro ajudar os outros e com isso me ajudar a aprender mais, a conhecer pessoas, suas histórias e um pouco mais... **Não acredita?** Então veja meu [perfil](https://pt.stackoverflow.com/users/95771/cmte-cardeal) no StackOverflowPT. Sempre que posso, tentou ajudar e ensinar outros desenvolvedores com suas dúvidas e problemas. Pergunte alguma coisa lá, quem sabe eu consiga ajudar você :D... Ou me chame no Discord: `Cardeal#0563` e vamos bater um papo por lá ;).

---

<div align="center">

Projeto feito com :heart: e dedicação por Iglan Cardeal. Gostou? então deixe uma :star: neste repositório :).

</div>
