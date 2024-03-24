import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infra/typeorm/repositories/UserRepository';
import { ListUserInterface } from '../../domain/interfaces/user/ListUser.interface';

@Injectable()
export class ListUserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userRepository: UserRepository) { }

  public async index(): Promise<ListUserInterface> {
    return await this.userRepository.findAll();
  }
}
