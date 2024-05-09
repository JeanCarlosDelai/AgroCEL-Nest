import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UpdateProfileController } from '../../../../../src/Modules/User/infra/http/Controllers/profile/updateProfile.controller';
import { UpdateProfileService } from 'src/Modules/User/Services/profile/UpdateProfile.service';
import { UpdateProfileDto } from 'src/Modules/User/domain/Dto/UpdateProfileDto';
import { ProfileUpdateInterface } from 'src/Modules/User/domain/interfaces/profile/ProfileUpdate.interface';
import { vi } from 'vitest';

describe('updateProfileControllerUnit', () => {
  let updateProfileController: UpdateProfileController;
  let updateProfileService: UpdateProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateProfileController],
      providers: [
        {
          provide: UpdateProfileService,
          useValue: {
            update: vi.fn(),
          },
        },
      ],
    }).compile();

    updateProfileController = module.get<UpdateProfileController>(
      UpdateProfileController,
    );
    updateProfileService =
      module.get<UpdateProfileService>(UpdateProfileService);
  });

  test('Devem estar definidos', () => {
    expect(updateProfileController).toBeDefined();
    expect(updateProfileService).toBeDefined();
  });

  describe('updateProfile', () => {
    test('Deve ser possível alterar o e-mail e o nome do usuário', async () => {
      //Arrange
      const req: Partial<Request> = { user: { id: '1' } };
      const updateProfileDto: UpdateProfileDto = {
        email: 'teste2@gmail',
        name: 'Teste Teste2',
      };
      const expectedResponse: ProfileUpdateInterface = {
        user: {
          id: '1',
          name: 'Teste Teste2',
          email: 'teste2@gmail',
          password: 'teste123',
          avatar: 'teste.jpg',
          created_at: null,
          updated_at: null,
        },
        token: 'sdadasdadadada',
      };
      vi.spyOn(updateProfileService, 'update').mockResolvedValueOnce(
        expectedResponse,
      );
      //Act
      const result = await updateProfileController.update(
        updateProfileDto,
        req as Request,
      );
      //Assert
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
  });
});
