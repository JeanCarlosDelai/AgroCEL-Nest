import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../domain/Dto/LoginDto';
import { UserAuthenticatedInterface } from '../../domain/interfaces/login/UserAuthenticated.interface';
import { sign, Secret } from 'jsonwebtoken';
import authConfig from '../../../../common/config/auth';
import { UserRepository } from '../../infra/typeorm/repositories/UserRepository';
import { BcryptHashProvider } from '../../infra/providers/HashProvider/implementations/BcryptHashProvider';

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: BcryptHashProvider,
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
        throw new UnauthorizedException('Email ou senha incorretos');
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
