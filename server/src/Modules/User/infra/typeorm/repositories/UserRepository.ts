import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../../domain/Dto/CreateUserDto';
import { User } from '../entities/User.entity';
import { UserRepositoryInterface } from '../../../domain/repositories/UserRepository.interface';
import { UserInterface } from '../../../domain/interfaces/user/User.interface';
import { ListUserInterface } from 'src/Modules/User/domain/interfaces/user/ListUser.interface';

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

  public async save(user: UserInterface): Promise<UserInterface> {
    await this.usersRepository.save(user);

    return user;
  }

  public async findAll(): Promise<ListUserInterface> {
    const users = await this.usersRepository
      .createQueryBuilder('users')
      .getMany();

    return {
      data: users,
    };
  }

  public async findByName(name: string): Promise<UserInterface | null> {
    return await this.usersRepository.findOneBy({
      name,
    });
  }

  public async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({
      id,
    });
  }

  public async findByEmail(email: string): Promise<UserInterface | null> {
    return await this.usersRepository.findOneBy({
      email,
    });
  }
}
