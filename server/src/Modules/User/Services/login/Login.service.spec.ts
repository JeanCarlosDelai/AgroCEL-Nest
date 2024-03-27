import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './Login.service';
import { LoginDto } from '../../domain/Dto/LoginDto';
import { UserInterface } from '../../domain/interfaces/user/User.interface';
import { UserAuthenticatedInterface } from '../../domain/interfaces/login/UserAuthenticated.interface';
import { HashProviderContract } from '../../domain/contracts/providers/HashProviderContract';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';

const userMock: UserInterface = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456',
  avatar: null,
  created_at: null,
  updated_at: null,
  getAvatarUrl: jest.fn().mockReturnValue('www.teste.com'),
};

const userAutenthicatedMock: UserAuthenticatedInterface = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    avatar: null,
    created_at: null,
    updated_at: null,
    getAvatarUrl: jest.fn().mockReturnValue('www.teste.com'),
  },
  token: 'sdadasdadadada',
};

describe('LoginService', () => {
  let loginService: LoginService;
  let userRepository: UserRepositoryContract;
  let hashProvider: HashProviderContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UserRepositoryContract,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: HashProviderContract,
          useValue: {
            compareHash: jest.fn(),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
    hashProvider = module.get<HashProviderContract>(HashProviderContract);
  });

  it('Devem estar definidos', () => {
    expect(loginService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
  });

  describe('login', () => {
    it('Deve ser possível efetuar o login', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: '123456',
      };
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      jest.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(true);

      //Act
      const result: UserAuthenticatedInterface =
        await loginService.login(loginDto);
      //Assert
      expect(result.user.name).toEqual(userAutenthicatedMock.user.name);
      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('Não Deve ser possível efetuar o login, Não foi encontrado usuário', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'john2@example.com',
        password: '1234567',
      };
      const expectErrorResponse = new UnauthorizedException(
        'Email ou senha incorretos',
      );
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

      //Act // Assert
      await expect(loginService.login(loginDto)).rejects.toThrow(
        expectErrorResponse,
      );
    });

    it('Não Deve ser possível efetuar o login, foi encontrado usuário mas o hash da senha não coincide ', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'john2@example.com',
        password: '1234567',
      };
      const expectErrorResponse = new UnauthorizedException('Senha incorreta');
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      jest.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(false);

      //Act // Assert
      await expect(loginService.login(loginDto)).rejects.toThrow(
        expectErrorResponse,
      );
    });

    it('Deve ser possível lançar um erro', () => {
      //Arrange
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockRejectedValueOnce(new Error());
      //Assert
      expect(loginService.login(null)).rejects.toThrow();
    });
  });
});
