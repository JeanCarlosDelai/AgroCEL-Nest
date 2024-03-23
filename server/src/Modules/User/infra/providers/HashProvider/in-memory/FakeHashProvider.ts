import { HashProviderInterface } from 'src/Modules/User/domain/providers/HashPovider.Interface';

export class FakeHashProvider implements HashProviderInterface {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
