import { User } from 'src/Modules/User/infra/typeorm/entities/User.entity';
import { UserRepositoryInterface } from 'src/Modules/User/domain/repositories/UserRepository.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../../../../domain/Dto/CreateUserDto';
import { UserInterface } from '../../../../domain/interfaces/user/User.interface';
import { ListUserInterface } from '../../../../domain/interfaces/user/ListUser.interface';

export class UsersRepositoryInMemory implements UserRepositoryInterface {
  private users: User[] = [];

  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserInterface> {
    const user = new User();

    user.id = uuidv4();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    this.users.push(user);

    return user;
  }

  public async save(user: UserInterface): Promise<UserInterface> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id,
    );

    this.users[findIndex] = user;

    return user;
  }

  public async remove(user: UserInterface): Promise<void> {
    const propertyIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id,
    );

    this.users.splice(propertyIndex, 1);
  }

  public async findAll(): Promise<ListUserInterface> {
    const usersPaginate: ListUserInterface = {
      data: this.users,
    };

    return usersPaginate;
  }

  public async findByName(name: string): Promise<User | null> {
    return this.users.find((user) => user.name === name);
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id);
  }

  public async findByEmail(email: string): Promise<UserInterface | null> {
    return this.users.find((user) => user.email === email);
  }
}
