import { Test, TestingModule } from '@nestjs/testing';
import { UserInterface } from '../../domain/interfaces/user/User.interface';
import { UserRepositoryContract } from '../../domain/contracts/repositories/UserRepositoryContract';
import { ShowProfileService } from './ShowProfile.service';
import { BadRequestException } from '@nestjs/common';

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

describe('ShowProfileService', () => {
  let showProfileService: ShowProfileService;
  let userRepository: UserRepositoryContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowProfileService,
        {
          provide: UserRepositoryContract,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    showProfileService = module.get<ShowProfileService>(ShowProfileService);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
  });

  it('Devem estar definidos', () => {
    expect(showProfileService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('show', () => {
    it('Deve ser possível retornar o usuário logado', async () => {
      //Arrange
      const userId: string = '1';
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      //Act
      const result: UserInterface = await showProfileService.show(userId);
      //Assert
      expect(result).toEqual(userMock);
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
    });
    it('Não Deve ser possível retornar o usuário logado, Não foi encontrado usuário', async () => {
      //Arrange
      const userId: string = '1';
      const expectErrorResponse = new BadRequestException(
        'Usuário não encontrado!',
      );
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);
      //Act // Assert
      await expect(showProfileService.show(userId)).rejects.toThrow(
        expectErrorResponse,
      );
    });
    it('Deve ser possível lançar um erro', () => {
      //Arrange
      jest.spyOn(userRepository, 'findById').mockRejectedValueOnce(new Error());
      //Assert
      expect(showProfileService.show(null)).rejects.toThrow();
    });
  });
});
