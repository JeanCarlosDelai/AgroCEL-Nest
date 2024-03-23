import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../domain/Dto/CreateUserDto';
import { User } from '../infra/typeorm/User.entity';
import { UserRepositoryInterface } from './UserRepository.interface';
import { UserInterface } from '../domain/interfaces/user/User.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  public async findByEmail(email: string): Promise<UserInterface | null> {
    return await this.usersRepository.findOneBy({
      email,
    });
  }
}
