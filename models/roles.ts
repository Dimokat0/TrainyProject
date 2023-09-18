import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { users } from './users';

@Table
export class roles extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id!: number;

  @Column({type: DataType.STRING})
  name!: string;

  @HasMany(() => users)
  users!: users[];
}
