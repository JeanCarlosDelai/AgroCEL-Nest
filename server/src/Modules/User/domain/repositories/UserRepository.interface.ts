import { CreateUserDto } from '../Dto/CreateUserDto';
import { ListUserInterface } from '../interfaces/user/ListUser.interface';
import { UserInterface } from '../interfaces/user/User.interface';

export interface UserRepositoryInterface {
  createUser(createUserDto: CreateUserDto): Promise<UserInterface>;
  save(user: UserInterface): Promise<UserInterface>;
  findAll(): Promise<ListUserInterface>;
  findByName(name: string): Promise<UserInterface | null>;
  findById(id: string): Promise<UserInterface | null>;
  findByEmail(email: string): Promise<UserInterface | null>;
}
