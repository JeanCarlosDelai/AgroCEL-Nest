import { UserInterface } from '../user/User.interface';

export interface UserAuthenticatedInterface {
  user: UserInterface;
  token: string;
}
