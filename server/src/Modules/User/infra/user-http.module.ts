import { Module } from '@nestjs/common';
import { CreateUserService } from '../Services/user/createUser.service';
import { CreateUserController } from './Controllers/user/createUser.controller';
import { UserModule } from './user.module';
import { UserRepository } from '../repositories/UserRepository';

@Module({
  imports: [UserModule],
  controllers: [CreateUserController],
  providers: [CreateUserService, UserRepository],
})
// eslint-disable-next-line prettier/prettier
export class UserHTTPModule { }
