import { Module } from '@nestjs/common';
import { CreateUserService } from '../Services/user/CreateUser.service';
import { CreateUserController } from './Controllers/user/createUser.controller';
import { UserModule } from './User.module';
import { UserRepository } from './typeorm/repositories/UserRepository';
import { LoginService } from '../Services/login/Login.service';
import { LoginController } from './Controllers/auth/login.controller';
import { BcryptHashProvider } from './providers/HashProvider/implementations/BcryptHashProvider';
import { ListUserService } from '../Services/user/ListUser.service';
import { ShowProfileService } from '../Services/profile/ShowProfile.service';
import { UpdateProfileService } from '../Services/profile/UpdateProfile.service';
import { ShowProfileController } from './Controllers/profile/showProfile.controller';
import { UpdateProfileController } from './Controllers/profile/updateProfile.controller';
import { ListUserController } from './Controllers/user/listUsers.controller';
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
    UserRepository,
    LoginService,
    BcryptHashProvider,
  ],
})
// eslint-disable-next-line prettier/prettier
export class UserHTTPModule { }
