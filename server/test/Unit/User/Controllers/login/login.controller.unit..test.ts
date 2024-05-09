import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from '../../../../../src/Modules/User/infra/http/Controllers/auth/login.controller';
import { LoginService } from 'src/Modules/User/Services/login/Login.service';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';
import { UserAuthenticatedInterface } from 'src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';
import { vi } from 'vitest';

describe('LoginController', () => {
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
    it('Deve ser possível fazer o login', async () => {
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

    it('Deve ser possível retornar uma erro', () => {
      //Arrange
      vi.spyOn(loginService, 'login').mockRejectedValueOnce(new Error());
      //Assert
      expect(loginController.login(null)).rejects.toThrow();
    });
  });
});
