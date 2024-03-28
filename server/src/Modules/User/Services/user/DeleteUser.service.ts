import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly userRepository: UserRepositoryContract,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async delete(userId: string): Promise<void> {
    const userExists = await this.userRepository.findById(userId);

    if (!userExists) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    await this.userRepository.remove(userExists);
  }
}
