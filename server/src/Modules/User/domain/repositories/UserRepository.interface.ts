import { CreateUserDto } from '../Dto/CreateUserDto';
import { UserInterface } from '../interfaces/User.interface';

export interface UserRepositoryInterface {
  store(createUserDto: CreateUserDto): Promise<UserInterface>;
}
