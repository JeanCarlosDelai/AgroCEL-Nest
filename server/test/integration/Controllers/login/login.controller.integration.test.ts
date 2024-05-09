import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from 'src/Modules/User/Services/login/Login.service';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';
import {
  PASSWORD_INCORRECT,
  USER_NOT_FOUND,
} from 'src/Modules/User/domain/consts/user.consts';
import { HashProviderContract } from 'src/Modules/User/domain/contracts/providers/HashProviderContract';
import { UserRepositoryContract } from 'src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { LoginController } from 'src/Modules/User/infra/http/Controllers/auth/login.controller';
import { FakeHashProvider } from 'src/Modules/User/infra/providers/HashProvider/in-memory/FakeHashProvider';
import { UsersRepositoryInMemory } from 'src/Modules/User/infra/providers/repositories/in-memory/UsersRepositoryInMemory';

describe('LoginControllerIntegration', () => {
  let loginController: LoginController;
  let loginService: LoginService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
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

    loginController = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
  });

  test('Devem estar definidos', () => {
    expect(loginController).toBeDefined();
    expect(loginService).toBeDefined();
  });

  describe('login', () => {
    test('Deve ser possível efetuar o login com sucesso', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'teste@gmail',
        password: 'teste123',
      };
      //Act
      const result = await loginController.login(loginDto);
      //Assert
      expect(result.token).toBeDefined();
      expect(result.user.email).toEqual(loginDto.email);
    });
  });

  test('Deve ser possível retornar erro que o usuário não foi encontrado', async () => {
    //Arrange
    const loginDto: LoginDto = {
      email: 'teste4@gmail',
      password: 'teste1234',
    };
    const expectedError = new UnauthorizedException(USER_NOT_FOUND);
    //Act / Assert
    await expect(loginController.login(loginDto)).rejects.toThrow(
      expectedError,
    );
  });

  test('Deve ser possível retornar erro que a senha é inválida', async () => {
    //Arrange
    const loginDto: LoginDto = {
      email: 'teste@gmail',
      password: 'invalid',
    };
    const expectedError = new UnauthorizedException(PASSWORD_INCORRECT);
    //Act / Assert
    await expect(loginController.login(loginDto)).rejects.toThrow(
      expectedError,
    );
  });
});
