import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../infra/typeorm/repositories/UserRepository';
import { UpdateProfileDto } from '../../domain/Dto/UpdateProfileDto';
import { compare, hash } from 'bcryptjs';
import { sign, Secret } from 'jsonwebtoken';
import authConfig from '../../../../common/config/auth';
import { ProfileUpdateInterface } from '../../domain/interfaces/profile/ProfileUpdate.interface';

@Injectable()
export class UpdateProfileService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userRepository: UserRepository) { }

  public async update(
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileUpdateInterface> {
    const user = await this.userRepository.findById(updateProfileDto.userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    const userUpdateEmail = await this.userRepository.findByEmail(
      updateProfileDto.email,
    );

    if (userUpdateEmail && userUpdateEmail.id !== updateProfileDto.userId) {
      throw new BadRequestException('Já existe um usuário com este email!');
    }

    if (updateProfileDto.password && !updateProfileDto.old_password) {
      throw new BadRequestException('Senha antiga é obrigatória!');
    }

    if (updateProfileDto.password && updateProfileDto.old_password) {
      const checkOldPassword = await compare(
        updateProfileDto.old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new BadRequestException('Senha antiga está incorreta!');
      }

      user.password = await hash(updateProfileDto.password, 8);
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
