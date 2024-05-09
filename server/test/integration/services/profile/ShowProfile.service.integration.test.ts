import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { USER_NOT_FOUND } from 'src/Modules/User/domain/consts/user.consts';
import { UsersRepositoryInMemory } from 'src/Modules/User/infra/providers/repositories/in-memory/UsersRepositoryInMemory';
import { ShowProfileService } from 'src/Modules/User/Services/profile/ShowProfile.service';
import { UserRepositoryContract } from 'src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { UserInterface } from 'src/Modules/User/domain/interfaces/user/User.interface';

describe('ShowProfileServiceIntegration', () => {
  let showProfileService: ShowProfileService;
  let userRepository: UserRepositoryContract;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowProfileService,
        {
          provide: UserRepositoryContract,
          useClass: UsersRepositoryInMemory,
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

  describe('showProfile', () => {
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
      //Act
      const result: UserInterface = await showProfileService.show(userId);
      //Assert
      expect(result).toEqual(userMock);
    });
    test('Não Deve ser possível retornar o usuário logado, Não foi encontrado usuário', async () => {
      //Arrange
      const userId: string = '2';
      const expectErrorResponse = new BadRequestException(USER_NOT_FOUND);
      //Act // Assert
      await expect(showProfileService.show(userId)).rejects.toThrow(
        expectErrorResponse,
      );
    });
  });
});
