import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from '../../../../../src/Modules/User/Services/login/Login.service';
import { LoginDto } from '../../../../../src/Modules/User/domain/Dto/LoginDto';
import { UserInterface } from '../../../../../src/Modules/User/domain/interfaces/user/User.interface';
import { UserAuthenticatedInterface } from '../../../../../src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';
import { HashProviderContract } from '../../../../../src/Modules/User/domain/contracts/providers/HashProviderContract';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepositoryContract } from '../../../../../src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { test, vi } from 'vitest';
import {
  PASSWORD_INCORRECT,
  USER_NOT_FOUND,
} from 'src/Modules/User/domain/consts/user.consts';

describe('LoginServiceUnit', () => {
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
            findByEmail: vi.fn(),
          },
        },
        {
          provide: HashProviderContract,
          useValue: {
            compareHash: vi.fn(),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
    hashProvider = module.get<HashProviderContract>(HashProviderContract);
  });

  test('Devem estar definidos', () => {
    expect(loginService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
  });

  describe('login', () => {
    test('Deve ser possível efetuar o login', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: '123456',
      };
      const userMock: UserInterface = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        avatar: null,
        created_at: null,
        updated_at: null,
      };
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      vi.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(true);
      //Act
      const result: UserAuthenticatedInterface =
        await loginService.login(loginDto);
      //Assert
      expect(result.user.name).toEqual(userMock.name);
      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(hashProvider.compareHash).toHaveBeenCalledTimes(1);
    });
    test('Não Deve ser possível efetuar o login, Não foi encontrado usuário', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'john2@example.com',
        password: '1234567',
      };
      const expectErrorResponse = new UnauthorizedException(USER_NOT_FOUND);
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
      //Act // Assert
      await expect(loginService.login(loginDto)).rejects.toThrow(
        expectErrorResponse,
      );
    });
    test('Não Deve ser possível efetuar o login, senha incorreta', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'john2@example.com',
        password: '1234567',
      };
      const userMock: UserInterface = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        avatar: null,
        created_at: null,
        updated_at: null,
      };
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      vi.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(false);
      const expectErrorResponse = new UnauthorizedException(PASSWORD_INCORRECT);
      //Act // Assert
      await expect(loginService.login(loginDto)).rejects.toThrow(
        expectErrorResponse,
      );
    });
  });
});
