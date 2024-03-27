import { Injectable } from '@nestjs/common';
import { ListUserInterface } from '../../domain/interfaces/user/ListUser.interface';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';

@Injectable()
export class ListUserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userRepository: UserRepositoryContract) { }

  public async index(): Promise<ListUserInterface> {
    return await this.userRepository.findAll();
  }
}
