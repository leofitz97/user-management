import { Table, Model, Column, DataType, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare updatedAt: Date;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const saltRounds = 12;
      instance.password = await bcrypt.hash(instance.password, saltRounds);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}