import { UserInterface } from '../user/User.interface';

export interface UserAuthenticated {
  user: UserInterface;
  token: string;
}
