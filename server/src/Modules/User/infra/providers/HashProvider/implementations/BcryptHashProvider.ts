import { compare, hash } from 'bcryptjs';
import { HashProviderContract } from 'src/Modules/User/domain/providers/HashProviderContract';

export class BcryptHashProvider implements HashProviderContract {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
