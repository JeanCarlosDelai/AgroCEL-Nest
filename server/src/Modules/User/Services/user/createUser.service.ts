import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../domain/Dto/CreateUserDto';
import { UserRepository } from '../../infra/typeorm/repositories/UserRepository';
import { UserInterface } from '../../domain/interfaces/user/User.interface';
import { BcryptHashProvider } from '../../infra/providers/HashProvider/implementations/BcryptHashProvider';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: BcryptHashProvider,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async store(createUserDto: CreateUserDto): Promise<UserInterface> {
    // return this.userRepository.createUser(createUserDto);

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
