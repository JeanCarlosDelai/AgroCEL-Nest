import { UserInterface } from './User.interface';

export interface UserAuthenticated {
  user: UserInterface;
  token: string;
}
