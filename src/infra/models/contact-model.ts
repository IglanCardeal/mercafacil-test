import { Contact } from '@src/domain/models/contact';
import { DataTypes, Model, Optional } from 'sequelize';
import { databases } from '../database/sequelize';

const baseClientStructure = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  cellphone: {
    type: DataTypes.STRING,
  },
};

type ContactAttributes = Optional<Contact, 'id'>;

export class MacapaContact
  extends Model<Contact, ContactAttributes>
  implements ContactAttributes
{
  public id: any;
  public name!: string;
  public cellphone!: string;
}

export class VarejaoContact
  extends Model<Contact, ContactAttributes>
  implements ContactAttributes
{
  public id: any;
  public name!: string;
  public cellphone!: string;
}

MacapaContact.init(baseClientStructure, {
  tableName: 'contacts',
  timestamps: false,
  sequelize: databases.mysqlConnection,
  freezeTableName: true,
});

VarejaoContact.init(baseClientStructure, {
  tableName: 'contacts',
  timestamps: false,
  sequelize: databases.postgresConnection,
  freezeTableName: true,
});

export default { MacapaContact, VarejaoContact };
