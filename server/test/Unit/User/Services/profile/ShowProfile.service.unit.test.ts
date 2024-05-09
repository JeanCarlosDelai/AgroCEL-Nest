import { Test, TestingModule } from '@nestjs/testing';
import { UserInterface } from '../../../../../src/Modules/User/domain/interfaces/user/User.interface';
import { UserRepositoryContract } from '../../../../../src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { ShowProfileService } from '../../../../../src/Modules/User/Services/profile/ShowProfile.service';
import { BadRequestException } from '@nestjs/common';
import { vi } from 'vitest';
import { USER_NOT_FOUND } from 'src/Modules/User/domain/consts/user.consts';

describe('ShowProfileServiceUnit', () => {
  let showProfileService: ShowProfileService;
  let userRepository: UserRepositoryContract;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowProfileService,
        {
          provide: UserRepositoryContract,
          useValue: {
            findById: vi.fn(),
          },
        },
      ],
    }).compile();

    showProfileService = module.get<ShowProfileService>(ShowProfileService);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
  });

  test('Devem estar definidos', () => {
    expect(showProfileService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('show', () => {
    test('Deve ser possível retornar o usuário logado', async () => {
      //Arrange
      const userId: string = '1';
      const userMock: UserInterface = {
        id: '1',
        name: 'Teste Teste',
        email: 'teste@gmail',
        password: 'teste123',
        avatar: 'teste.jpg',
        created_at: null,
        updated_at: null,
      };
      vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      //Act
      const result: UserInterface = await showProfileService.show(userId);
      //Assert
      expect(result).toEqual(userMock);
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
    });
    test('Não Deve ser possível retornar o usuário logado, Não foi encontrado usuário', async () => {
      //Arrange
      const userId: string = '1';
      const expectErrorResponse = new BadRequestException(USER_NOT_FOUND);
      vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);
      //Act // Assert
      await expect(showProfileService.show(userId)).rejects.toThrow(
        expectErrorResponse,
      );
    });
  });
});
