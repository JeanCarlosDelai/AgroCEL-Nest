import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';
import { LoginService } from 'src/Modules/User/Services/login/login.service';
import { UserAuthenticatedInterface } from 'src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';

@Controller('sessions')
export class LoginController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly loginService: LoginService) { }


  @Post()
  @UsePipes(ValidationPipe)
  async execute(
    @Body() loginDto: LoginDto,
  ): Promise<UserAuthenticatedInterface> {
    return await this.loginService.execute(loginDto);
  }
}
