import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../domain/Dto/CreateUserDto';
import { UserRepository } from '../../repositories/UserRepository';
import { UserInterface } from '../../domain/interfaces/user/User.interface';

@Injectable()
export class CreateUserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userRepository: UserRepository) { }

  async execute(createUserDto: CreateUserDto): Promise<UserInterface> {
    return this.userRepository.createUser(createUserDto);
  }
}
