import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../domain/Dto/LoginDto';
import { UserAuthenticatedInterface } from '../../domain/interfaces/login/UserAuthenticated.interface';
import { sign, Secret } from 'jsonwebtoken';
import { HashProviderContract } from '../../domain/contracts/providers/HashProviderContract';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';
import {
  PASSWORD_INCORRECT,
  USER_NOT_FOUND,
} from '../../domain/consts/user.consts';

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly hashProvider: HashProviderContract,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async login(loginDto: LoginDto): Promise<UserAuthenticatedInterface> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }
    const passwordConfirmed = await this.hashProvider.compareHash(
      loginDto.password,
      user.password,
    );

    if (!passwordConfirmed) {
      throw new UnauthorizedException(PASSWORD_INCORRECT);
    }

    const token = sign({}, process.env.JWT_SECRET as Secret, {
      subject: user.id,
      expiresIn: process.env.JWT_LIFETIME,
    });

    return {
      user,
      token,
    };
  }
}
