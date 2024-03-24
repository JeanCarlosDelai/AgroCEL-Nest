import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';
import { LoginService } from 'src/Modules/User/Services/login/Login.service';
import { UserAuthenticatedInterface } from 'src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';
import { instanceToInstance } from 'class-transformer';

@Controller('sessions')
export class LoginController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly loginService: LoginService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto): Promise<UserAuthenticatedInterface> {
    return instanceToInstance(await this.loginService.login(loginDto));
  }
}
