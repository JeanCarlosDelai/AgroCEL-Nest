import { Test, TestingModule } from '@nestjs/testing';
import { ProfileUpdateInterface } from 'src/Modules/User/domain/interfaces/profile/ProfileUpdate.interface';
import { LoginController } from './login.controller';
import { LoginService } from 'src/Modules/User/Services/login/Login.service';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';

const userMock: ProfileUpdateInterface = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'XXXXXXXX',
    avatar: null,
    created_at: null,
    updated_at: null,
    getAvatarUrl: jest.fn().mockReturnValue('www.teste.com'),
  },
  token: 'sdadasdadadada',
};

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
            login: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
    }).compile();

    loginController = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
  });

  it('Devem estar definidos', () => {
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
      //Act
      const result = await loginController.login(loginDto);
      //Assert
      expect(result).toEqual(userMock);
      expect(loginService.login).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível retornar uma erro', () => {
      //Arrange
      jest.spyOn(loginService, 'login').mockRejectedValueOnce(new Error());
      //Assert
      expect(loginController.login(null)).rejects.toThrow();
    });
  });
});
