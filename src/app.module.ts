import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { Role } from './role/role.model';
import { Post } from './post/post.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'qwerty',
      database: 'first_project',
      models: [User, Role, Post],
      synchronize: true,
    }),
    AuthModule,
    PostModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigModule],
})
export class AppModule {}
