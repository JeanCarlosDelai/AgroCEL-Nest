import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';
import { ListUserService } from 'src/Modules/User/Services/user/ListUser.service';
import { ListUserInterface } from 'src/Modules/User/domain/interfaces/user/ListUser.interface';

@Controller('users')
export class ListUserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly listUserService: ListUserService) { }

  @Get()
  @UsePipes(ValidationPipe)
  async index(): Promise<ListUserInterface> {
    const user = await this.listUserService.index();
    // Remove o password na resposta
    return instanceToInstance(user);
  }
}
