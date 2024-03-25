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

describe('updateProfileController', () => {
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

  it('should be defined', () => {
    expect(loginController).toBeDefined();
    expect(loginService).toBeDefined();
  });

  describe('Show', () => {
    it('should be possible to show an user', async () => {
      //Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'XXXXXXXX',
      };
      //Act
      const result = await loginController.login(loginDto);
      //Assert
      expect(result).toEqual(userMock);
    });

    it('Should throw an exception', () => {
      //Arrange
      jest.spyOn(loginService, 'login').mockRejectedValueOnce(new Error());
      //Assert
      expect(loginController.login(null)).rejects.toThrow();
    });
  });
});
