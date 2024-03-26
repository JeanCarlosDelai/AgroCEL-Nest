import { HashProviderContract } from 'src/Modules/User/domain/providers/HashProviderContract';

export class FakeHashProvider implements HashProviderContract {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
