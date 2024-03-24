import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../infra/typeorm/repositories/UserRepository';
import { UserInterface } from '../../domain/interfaces/user/User.interface';

@Injectable()
export class ShowProfileService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userRepository: UserRepository) { }

  public async show(userId: string): Promise<UserInterface> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    return user;
  }
}
