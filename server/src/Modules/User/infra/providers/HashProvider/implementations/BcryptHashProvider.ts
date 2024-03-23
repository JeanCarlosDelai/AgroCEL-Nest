import { compare, hash } from 'bcryptjs';
import { HashProviderInterface } from 'src/Modules/User/domain/providers/HashPovider.Interface';

export class BcryptHashProvider implements HashProviderInterface {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
