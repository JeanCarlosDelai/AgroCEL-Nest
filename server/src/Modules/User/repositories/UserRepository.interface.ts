import { CreateUserDto } from '../domain/Dto/CreateUserDto';
import { UserInterface } from '../domain/interfaces/user/User.interface';

export interface UserRepositoryInterface {
  createUser(createUserDto: CreateUserDto): Promise<UserInterface>;
  findByEmail(email: string): Promise<UserInterface | null>;
}
