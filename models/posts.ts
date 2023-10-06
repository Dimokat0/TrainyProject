import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { users } from './users';

@Table
export class posts extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    id!: number;

    @Column({type: DataType.STRING})
    name!: string;

    @Column({type: DataType.DATE})
    date!: Date;

    @Column({type: DataType.STRING})
    caption!: string;

    @ForeignKey(() => users)
    @Column({ type: DataType.INTEGER })
    authorId!: number;

    @BelongsTo(() => users, 'authorId')
    author!: users;
}
