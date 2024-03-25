import { CreateUserController } from './createUser.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from '../../../Services/user/CreateUser.service';
import { CreateUserDto } from 'src/Modules/User/domain/Dto/CreateUserDto';
import { UserInterface } from 'src/Modules/User/domain/interfaces/user/User.interface';

const mokUser: UserInterface = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'XXXXXXXX',
  avatar: null,
  created_at: null,
  updated_at: null,
  getAvatarUrl: jest.fn().mockReturnValue('www.teste.com'),
};

describe('CreateUserController', () => {
  let createUserController: CreateUserController;
  let createUserService: CreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        {
          provide: CreateUserService,
          useValue: {
            store: jest.fn().mockResolvedValue(mokUser),
          },
        },
      ],
    }).compile();

    createUserController =
      module.get<CreateUserController>(CreateUserController);
    createUserService = module.get<CreateUserService>(CreateUserService);
  });

  it('should be defined', () => {
    expect(createUserController).toBeDefined();
    expect(createUserService).toBeDefined();
  });

  describe('store', () => {
    it('should store a user', async () => {
      //Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'XXXXXXXX',
      };
      //Act
      const user = await createUserController.store(createUserDto);
      //Assert
      expect(user).toEqual(mokUser);
      expect(createUserService.store).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exception', () => {
      //Arrange
      jest.spyOn(createUserService, 'store').mockRejectedValueOnce(new Error());
      //Assert
      expect(createUserController.store(null)).rejects.toThrow();
    });
  });
});
