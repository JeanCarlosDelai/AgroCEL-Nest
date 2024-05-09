import {
  PASSWORD_INCORRECT,
  USER_NOT_FOUND,
} from 'src/Modules/User/domain/consts/user.consts';
import { LoginService } from 'src/Modules/User/Services/login/Login.service';
import { UserRepositoryContract } from 'src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { HashProviderContract } from 'src/Modules/User/domain/contracts/providers/HashProviderContract';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepositoryInMemory } from 'src/Modules/User/infra/providers/repositories/in-memory/UsersRepositoryInMemory';
import { FakeHashProvider } from 'src/Modules/User/infra/providers/HashProvider/in-memory/FakeHashProvider';
import { UnauthorizedException } from '@nestjs/common';
import { UserInterface } from 'src/Modules/User/domain/interfaces/user/User.interface';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';
import { UserAuthenticatedInterface } from 'src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';

describe('LoginServiceIntegration', () => {
  let loginService: LoginService;
  let userRepository: UserRepositoryContract;
  let hashProvider: HashProviderContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UserRepositoryContract,
          useClass: UsersRepositoryInMemory,
        },
        {
          provide: HashProviderContract,
          useClass: FakeHashProvider,
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
        email: 'teste@gmail',
        password: 'teste123',
      };
      const userMock: UserInterface = {
        id: '1',
        name: 'Teste Teste',
        email: 'teste@gmail',
        password: 'teste123',
        avatar: 'teste.jpg',
        created_at: null,
        updated_at: null,
      };
      //Act
      const result: UserAuthenticatedInterface =
        await loginService.login(loginDto);
      //Assert
      expect(result.user.name).toEqual(userMock.name);
    });
    test('Não Deve ser possível efetuar o login, Não foi encontrado usuário', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'teste6@gmail',
        password: 'teste123',
      };
      const expectErrorResponse = new UnauthorizedException(USER_NOT_FOUND);
      //Act // Assert
      await expect(loginService.login(loginDto)).rejects.toThrow(
        expectErrorResponse,
      );
    });
    test('Não Deve ser possível efetuar o login, senha incorreta', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'teste@gmail',
        password: 'teste1234',
      };
      const expectErrorResponse = new UnauthorizedException(PASSWORD_INCORRECT);
      //Act // Assert
      await expect(loginService.login(loginDto)).rejects.toThrow(
        expectErrorResponse,
      );
    });
  });
});
