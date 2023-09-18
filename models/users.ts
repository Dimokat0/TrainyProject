import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { roles } from './roles';

@Table
export class users extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id!: number;

  @Column({
    type: DataType.INTEGER
  })
  username!: string;

  @Column({
    type: DataType.INTEGER
  })
  password!: string;

  @ForeignKey(() => roles)
  @Column({
    type: DataType.INTEGER
  })
  role_id!: number;

  @BelongsTo(() => roles)
  role!: roles;
}
