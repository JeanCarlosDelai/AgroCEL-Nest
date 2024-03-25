import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';
import { CreateUserService } from 'src/Modules/User/Services/user/CreateUser.service';
import { CreateUserDto } from 'src/Modules/User/domain/Dto/CreateUserDto';
import { UserInterface } from 'src/Modules/User/domain/interfaces/user/User.interface';

@Controller('users')
export class CreateUserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly createUserService: CreateUserService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async store(@Body() createUserDto: CreateUserDto): Promise<UserInterface> {
    const user = await this.createUserService.store(createUserDto);
    // Remove o password na resposta
    return instanceToInstance(user);
  }
}
