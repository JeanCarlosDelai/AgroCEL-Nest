import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../domain/Dto/CreateUserDto';
import { UserRepository } from '../../repositories/UserRepository';

@Injectable()
export class CreateUserService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userRepository: UserRepository) { }

  async execute(createUserDto: CreateUserDto): Promise<any> {
    const user = this.userRepository.createUser(createUserDto);

    return user;
  }
}
