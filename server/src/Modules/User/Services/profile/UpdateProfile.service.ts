import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../../domain/Dto/UpdateProfileDto';
import { sign, Secret } from 'jsonwebtoken';
import authConfig from '../../../../common/config/auth';
import { ProfileUpdateInterface } from '../../domain/interfaces/profile/ProfileUpdate.interface';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';
import { HashProviderContract } from '../../domain/contracts/providers/HashProviderContract';

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
      throw new BadRequestException('Usuário não encontrado!');
    }
    console.log(updateProfileDto.email);
    if (updateProfileDto.email) {
      const userUpdateEmail = await this.userRepository.findByEmail(
        updateProfileDto.email,
      );
      console.log(userUpdateEmail);

      if (userUpdateEmail && userUpdateEmail.id !== updateProfileDto.userId) {
        throw new BadRequestException('Já existe um usuário com este email!');
      }
    }

    if (updateProfileDto.password && !updateProfileDto.old_password) {
      throw new BadRequestException('Senha antiga é obrigatória!');
    }

    if (updateProfileDto.password && updateProfileDto.old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        updateProfileDto.old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new BadRequestException('Senha antiga está incorreta!');
      }

      user.password = await this.hashProvider.generateHash(
        updateProfileDto.password,
      );
    }

    user.name = updateProfileDto.name;
    user.email = updateProfileDto.email;

    await this.userRepository.save(user);

    const token = sign({}, authConfig.jwt.secret as Secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
