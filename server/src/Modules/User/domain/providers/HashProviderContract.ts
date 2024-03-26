export abstract class HashProviderContract {
  abstract generateHash(payload: string): Promise<string>;
  abstract compareHash(payload: string, hashed: string): Promise<boolean>;
}
