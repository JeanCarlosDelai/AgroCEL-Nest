import { UserInterface } from '../user/User.interface';

export interface ProfileUpdate {
  user: UserInterface;
  token: string;
}
