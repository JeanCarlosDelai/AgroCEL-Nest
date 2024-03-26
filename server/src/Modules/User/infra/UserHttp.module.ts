import { Module } from '@nestjs/common';
import { CreateUserService } from '../Services/user/CreateUser.service';
import { CreateUserController } from './Controllers/user/createUser.controller';
import { UserModule } from './User.module';
import { UserRepository } from './typeorm/repositories/UserRepository';
import { LoginService } from '../Services/login/Login.service';
import { LoginController } from './Controllers/auth/login.controller';
import { ListUserService } from '../Services/user/ListUser.service';
import { ShowProfileService } from '../Services/profile/ShowProfile.service';
import { UpdateProfileService } from '../Services/profile/UpdateProfile.service';
import { ShowProfileController } from './Controllers/profile/showProfile.controller';
import { UpdateProfileController } from './Controllers/profile/updateProfile.controller';
import { ListUserController } from './Controllers/user/listUsers.controller';
import { BcryptHashProvider } from './providers/HashProvider/implementations/BcryptHashProvider';
import { HashProviderContract } from '../domain/providers/HashProviderContract';
import { UserRepositoryContract } from '../domain/repositories/UserRepositoryContract';
@Module({
  imports: [UserModule],
  controllers: [
    LoginController,
    ShowProfileController,
    UpdateProfileController,
    CreateUserController,
    ListUserController,
  ],
  providers: [
    LoginService,
    ShowProfileService,
    UpdateProfileService,
    CreateUserService,
    ListUserService,
    LoginService,
    {
      provide: HashProviderContract,
      useClass: BcryptHashProvider,
    },
    {
      provide: UserRepositoryContract,
      useClass: UserRepository,
    },
  ],
})
// eslint-disable-next-line prettier/prettier
export class UserHTTPModule { }
