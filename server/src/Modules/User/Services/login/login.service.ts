import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../domain/Dto/LoginDto';
import { UserAuthenticatedInterface } from '../../domain/interfaces/login/UserAuthenticated.interface';
import { sign, Secret } from 'jsonwebtoken';
import authConfig from '../../../../common/config/auth';
import { HashProviderContract } from '../../domain/providers/HashProviderContract';
import { UserRepositoryContract } from '../../domain/repositories/UserRepositoryContract';

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
      throw new UnauthorizedException('Email ou senha incorretos');
    } else {
      const passwordConfirmed = await this.hashProvider.compareHash(
        loginDto.password,
        user.password,
      );

      if (!passwordConfirmed) {
        throw new UnauthorizedException('Senha incorreta');
      }

      const token = sign({}, process.env.JWT_SECRET as Secret, {
        subject: user.id,
        expiresIn: authConfig.jwt.expiresIn,
      });

      return {
        user,
        token,
      };
    }
  }
}
