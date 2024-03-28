import { Module } from '@nestjs/common';
import { CreateUserService } from '../Services/user/CreateUser.service';
import { CreateUserController } from './http/Controllers/user/createUser.controller';
import { UserModule } from './User.module';
import { UserRepository } from './providers/repositories/typeorm/implementations/UserRepository';
import { LoginService } from '../Services/login/Login.service';
import { LoginController } from './http/Controllers/auth/login.controller';
import { ListUserService } from '../Services/user/ListUser.service';
import { ShowProfileService } from '../Services/profile/ShowProfile.service';
import { UpdateProfileService } from '../Services/profile/UpdateProfile.service';
import { ShowProfileController } from './http/Controllers/profile/showProfile.controller';
import { UpdateProfileController } from './http/Controllers/profile/updateProfile.controller';
import { ListUserController } from './http/Controllers/user/listUsers.controller';
import { BcryptHashProvider } from './providers/HashProvider/implementations/BcryptHashProvider';
import { HashProviderContract } from '../domain/contracts/providers/HashProviderContract';
import { UserRepositoryContract } from '../domain/contracts/repositories/UserRepositoryContract';
import { DeleteUserController } from './http/Controllers/user/deleteUser.controller';
import { DeleteUserService } from '../Services/user/DeleteUser.service';
@Module({
  imports: [UserModule],
  controllers: [
    LoginController,
    ShowProfileController,
    UpdateProfileController,
    CreateUserController,
    ListUserController,
    DeleteUserController,
  ],
  providers: [
    LoginService,
    ShowProfileService,
    UpdateProfileService,
    CreateUserService,
    ListUserService,
    LoginService,
    DeleteUserService,
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
