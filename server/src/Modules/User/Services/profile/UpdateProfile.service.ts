import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../../domain/Dto/UpdateProfileDto';
import { sign, Secret } from 'jsonwebtoken';
import { ProfileUpdateInterface } from '../../domain/interfaces/profile/ProfileUpdate.interface';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';
import { HashProviderContract } from '../../domain/contracts/providers/HashProviderContract';
import {
  EMAIL_ALREADY_EXISTS,
  OLD_PASSWORD_INCORRECT,
  OLD_PASSWORD_REQUIRED,
  USER_NOT_FOUND,
} from '../../domain/consts/user.consts';

@Injectable()
export class UpdateProfileService {
  constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly hashProvider: HashProviderContract,
    // eslint-disable-next-line prettier/prettier
  ) { }

  public async update(
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileUpdateInterface> {
    const user = await this.userRepository.findById(updateProfileDto.userId);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    if (updateProfileDto.email) {
      const userUpdateEmail = await this.userRepository.findByEmail(
        updateProfileDto.email,
      );

      if (userUpdateEmail && userUpdateEmail.id !== updateProfileDto.userId) {
        throw new BadRequestException(EMAIL_ALREADY_EXISTS);
      }
    }

    if (updateProfileDto.password && !updateProfileDto.old_password) {
      throw new BadRequestException(OLD_PASSWORD_REQUIRED);
    }

    if (updateProfileDto.password && updateProfileDto.old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        updateProfileDto.old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new BadRequestException(OLD_PASSWORD_INCORRECT);
      }

      user.password = await this.hashProvider.generateHash(
        updateProfileDto.password,
      );
    }

    user.name = updateProfileDto.name;
    user.email = updateProfileDto.email;

    await this.userRepository.save(user);

    const token = sign({}, process.env.JWT_SECRET as Secret, {
      subject: user.id,
      expiresIn: process.env.JWT_LIFETIME,
    });

    return {
      user,
      token,
    };
  }
}
