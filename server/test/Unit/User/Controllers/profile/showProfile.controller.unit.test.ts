import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { ShowProfileService } from 'src/Modules/User/Services/profile/ShowProfile.service';
import { UserRepositoryContract } from 'src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { UserInterface } from 'src/Modules/User/domain/interfaces/user/User.interface';
import { ShowProfileController } from 'src/Modules/User/infra/http/Controllers/profile/showProfile.controller';
import { vi } from 'vitest';

describe('ShowProfileControllerUnit', () => {
  let showProfileController: ShowProfileController;
  let showProfileService: ShowProfileService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowProfileController],
      providers: [
        ShowProfileService,
        {
          provide: UserRepositoryContract,
          useValue: {
            show: vi.fn(),
          },
        },
      ],
    }).compile();

    showProfileController = module.get<ShowProfileController>(
      ShowProfileController,
    );
    showProfileService = module.get<ShowProfileService>(ShowProfileService);
  });

  test('Devem estar definidos', () => {
    expect(showProfileController).toBeDefined();
    expect(showProfileService).toBeDefined();
  });

  describe('showProfile', () => {
    test('Deve ser possível visualizar os dados do perfil do usuário', async () => {
      //Arrange
      const req: Partial<Request> = { user: { id: '1' } };
      const userMock: UserInterface = {
        id: '1',
        name: 'Teste Teste',
        email: 'teste@gmail',
        password: 'teste123',
        avatar: 'teste.jpg',
        created_at: null,
        updated_at: null,
      };
      vi.spyOn(showProfileService, 'show').mockResolvedValueOnce(userMock);
      //Act
      const result = await showProfileController.show(req as Request);
      //Assert
      expect(result).toEqual(userMock);
    });
  });
});
