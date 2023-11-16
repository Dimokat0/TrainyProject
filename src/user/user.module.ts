import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from 'src/role/role.model';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [SequelizeModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService, UserRepository, ConfigService],
  exports: [UserService],
})
export class UserModule {}
