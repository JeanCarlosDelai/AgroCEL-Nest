import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInterface } from '../../domain/interfaces/user/User.interface';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';
import { USER_NOT_FOUND } from '../../domain/consts/user.consts';

@Injectable()
export class ShowProfileService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userRepository: UserRepositoryContract) { }

  public async show(userId: string): Promise<UserInterface> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    return user;
  }
}
