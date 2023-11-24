import {
  Model,
  Column,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Tag } from '../tags/tag.model';

@Table
export class Post extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column
  name: string;

  @Column({ type: DataType.DATE })
  date: Date;

  @Column
  caption: string;

  @ForeignKey(() => User)
  @Column
  authorId: number;

  @BelongsTo(() => User, 'authorId')
  author: User;

  @BelongsToMany(() => Tag, {
    through: 'PostTags',
    foreignKey: 'postId',
    otherKey: 'tagId',
  })
  tags: Tag[];
}
