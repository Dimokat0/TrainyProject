import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { MyJwtPayload } from 'src/auth/auth.repository';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    readonly configService: ConfigService,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postModel.findAll({ include: ['author'] });
  }

  async createPost(
    name: string,
    caption: string,
    access_token: string,
  ): Promise<Post> {
    const payload = jwt.verify(
      access_token,
      this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    ) as MyJwtPayload;
    const authorId = payload.userId;
    return this.postModel.create({
      name,
      caption,
      date: new Date(),
      authorId,
    });
  }

  async updatePost(
    id: number,
    name?: string,
    caption?: string,
  ): Promise<[number]> {
    const updateData: Partial<{ name?: string; caption?: string }> = {};
    if (name) updateData.name = name;
    if (caption) updateData.caption = caption;
    return this.postModel.update(updateData, { where: { id } });
  }

  async deletePost(id: number): Promise<void> {
    await this.postModel.destroy({ where: { id } });
  }
}
