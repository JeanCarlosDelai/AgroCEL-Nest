import { Module } from '@nestjs/common';
import { CreateUserService } from '../Services/user/createUser.service';
import { CreateUserController } from './Controllers/user/createUser.controller';
import { UserModule } from './User.module';
import { UserRepository } from './typeorm/repositories/UserRepository';
import { LoginService } from '../Services/login/login.service';
import { LoginController } from './Controllers/auth/login.controller';
import { BcryptHashProvider } from './providers/HashProvider/implementations/BcryptHashProvider';
@Module({
  imports: [UserModule],
  controllers: [CreateUserController, LoginController],
  providers: [
    CreateUserService,
    UserRepository,
    LoginService,
    BcryptHashProvider,
  ],
})
// eslint-disable-next-line prettier/prettier
export class UserHTTPModule { }
