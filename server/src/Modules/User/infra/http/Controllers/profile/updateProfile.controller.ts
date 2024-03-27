import { Body, Controller, Put, Req } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';
import { Request } from 'express';
import { UpdateProfileService } from 'src/Modules/User/Services/profile/UpdateProfile.service';
import { UpdateProfileDto } from 'src/Modules/User/domain/Dto/UpdateProfileDto';
import { ProfileUpdateInterface } from 'src/Modules/User/domain/interfaces/profile/ProfileUpdate.interface';

@Controller('profile')
export class UpdateProfileController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly updateProfileService: UpdateProfileService) { }

  @Put()
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
  ): Promise<ProfileUpdateInterface> {
    updateProfileDto.userId = req.user.id;
    const user = await this.updateProfileService.update(updateProfileDto);

    // Remove o password na resposta
    return instanceToInstance(user);
  }
}
