import { UserInterface } from '../user/User.interface';

export interface ProfileUpdateInterface {
  user: UserInterface;
  token: string;
}
