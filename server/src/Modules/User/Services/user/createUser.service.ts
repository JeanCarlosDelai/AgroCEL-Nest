import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../domain/Dto/CreateUserDto';
import { UserInterface } from '../../domain/interfaces/user/User.interface';
import { HashProviderContract } from '../../domain/contracts/providers/HashProviderContract';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly hashProvider: HashProviderContract,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async store(createUserDto: CreateUserDto): Promise<UserInterface> {
    const emailExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (emailExists) {
      throw new BadRequestException('Email já está em uso!');
    }

    const hashedPassword = await this.hashProvider.generateHash(
      createUserDto.password,
    );

    createUserDto.password = hashedPassword;

    return await this.userRepository.createUser(createUserDto);
  }
}
