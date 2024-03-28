import {
  Controller,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteUserService } from 'src/Modules/User/Services/user/DeleteUser.service';

@Controller('users')
export class DeleteUserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly deleteUserService: DeleteUserService) { }

  @Delete(':userId')
  @UsePipes(ValidationPipe)
  async delete(@Param('userId') userId: string): Promise<void> {
    await this.deleteUserService.delete(userId);
  }
}
