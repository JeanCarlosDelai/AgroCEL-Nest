import { Controller, Get, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';
import { Request } from 'express';
import { ShowProfileService } from 'src/Modules/User/Services/profile/ShowProfile.service';
import { UserInterface } from 'src/Modules/User/domain/interfaces/user/User.interface';

@Controller('profile')
export class ShowProfileController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly showProfileService: ShowProfileService) { }

  @Get()
  @UsePipes(ValidationPipe)
  async show(@Req() req: Request): Promise<UserInterface> {
    const user = await this.showProfileService.show(req.user.id);
    // Remove o password na resposta
    return instanceToInstance(user);
  }
}
