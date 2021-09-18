import { Client } from '@src/domain/models/client';
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
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
  },
  uuid: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
};

type ClientAttributes = Optional<Client, 'id'>;

export class MacapaClient
  extends Model<Client, ClientAttributes>
  implements ClientAttributes
{
  public id: any;
  public uuid!: string;
  public name!: string;
  public type!: any;
  public password!: string;
  public email!: string;
}

export class VarejaoClient
  extends Model<Client, ClientAttributes>
  implements ClientAttributes
{
  public id: any;
  public uuid!: string;
  public name!: string;
  public type!: any;
  public password!: string;
  public email!: string;
}

MacapaClient.init(baseClientStructure, {
  tableName: 'clients',
  timestamps: false,
  sequelize: databases.mysqlConnection,
});

VarejaoClient.init(baseClientStructure, {
  tableName: 'clients',
  timestamps: false,
  sequelize: databases.postgresConnection,
});

export default { MacapaClient, VarejaoClient };
