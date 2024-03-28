import { CreateUserDto } from '../../Dto/CreateUserDto';
import { ListUserInterface } from '../../interfaces/user/ListUser.interface';
import { UserInterface } from '../../interfaces/user/User.interface';

export abstract class UserRepositoryContract {
  abstract createUser(createUserDto: CreateUserDto): Promise<UserInterface>;
  abstract save(user: UserInterface): Promise<UserInterface>;
  abstract findAll(): Promise<ListUserInterface>;
  abstract findByName(name: string): Promise<UserInterface | null>;
  abstract findById(id: string): Promise<UserInterface | null>;
  abstract findByEmail(email: string): Promise<UserInterface | null>;
  abstract remove(user: UserInterface): Promise<void>;
}
