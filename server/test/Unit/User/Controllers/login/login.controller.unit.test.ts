import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from '../../../../../src/Modules/User/infra/http/Controllers/auth/login.controller';
import { LoginService } from 'src/Modules/User/Services/login/Login.service';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';
import { UserAuthenticatedInterface } from 'src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';
import { vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import {
  PASSWORD_INCORRECT,
  USER_NOT_FOUND,
} from 'src/Modules/User/domain/consts/user.consts';

describe('LoginControllerUnit', () => {
  let loginController: LoginController;
  let loginService: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: {
            login: vi.fn(),
          },
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
    test('Deve ser possível efetuar o login', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'XXXXXXXX',
      };
      const userMock: UserAuthenticatedInterface = {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: null,
          created_at: null,
          updated_at: null,
        },
        token: 'tokenMOCK',
      };
      vi.spyOn(loginService, 'login').mockResolvedValueOnce(userMock);
      //Act
      const result = await loginController.login(loginDto);
      //Assert
      expect(result).toEqual(userMock);
      expect(loginService.login).toHaveBeenCalledTimes(1);
    });

    test('Deve ser possível retornar erro que o usuário não foi encontrado', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'teste2@gmail',
        password: 'teste1234',
      };
      const expectedError = new UnauthorizedException(USER_NOT_FOUND);
      vi.spyOn(loginService, 'login').mockRejectedValueOnce(expectedError);
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
      vi.spyOn(loginService, 'login').mockRejectedValueOnce(expectedError);
      //Act / Assert
      await expect(loginController.login(loginDto)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
