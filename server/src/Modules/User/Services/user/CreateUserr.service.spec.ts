import { Test, TestingModule } from '@nestjs/testing';
import { UserInterface } from '../../domain/interfaces/user/User.interface';
import { UserRepositoryContract } from '../../domain/repositories/UserRepositoryContract';
import { BadRequestException } from '@nestjs/common';
import { HashProviderContract } from '../../domain/providers/HashProviderContract';
import { CreateUserService } from './CreateUser.service';
import { CreateUserDto } from '../../domain/Dto/CreateUserDto';

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

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let userRepository: UserRepositoryContract;
  let hashProvider: HashProviderContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: UserRepositoryContract,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: HashProviderContract,
          useValue: {
            generateHash: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserService = module.get<CreateUserService>(CreateUserService);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
    hashProvider = module.get<HashProviderContract>(HashProviderContract);
  });

  it('Devem estar definidos', () => {
    expect(createUserService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
  });

  describe('update', () => {
    it('Deve ser possível criar um novo usuario', async () => {
      //Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe2',
        email: 'john2@example.com',
        password: '123456',
      };
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(hashProvider, 'generateHash').mockResolvedValueOnce('123456');
      jest.spyOn(userRepository, 'createUser').mockResolvedValueOnce(userMock);
      //Act
      const result: UserInterface =
        await createUserService.store(createUserDto);
      //Assert
      expect(result).toEqual(userMock);
      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(hashProvider.generateHash).toHaveBeenCalledTimes(1);
      expect(userRepository.createUser).toHaveBeenCalledTimes(1);
    });

    it('Não Deve ser possível criar um novo usuário, Já existe um usuário com este email', async () => {
      //Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe2',
        email: 'john2@example.com',
        password: '123456',
      };
      const expectErrorResponse = new BadRequestException(
        'Email já está em uso!',
      );
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      //Act // Assert
      await expect(createUserService.store(createUserDto)).rejects.toThrow(
        expectErrorResponse,
      );
    });
    it('Deve ser possível retornar um erro', () => {
      //Arrange
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockRejectedValueOnce(new Error());
      //Assert
      expect(createUserService.store(null)).rejects.toThrow();
    });
  });
});
