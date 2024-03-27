import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './providers/repositories/typeorm/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
// eslint-disable-next-line prettier/prettier
export class UserModule { }
