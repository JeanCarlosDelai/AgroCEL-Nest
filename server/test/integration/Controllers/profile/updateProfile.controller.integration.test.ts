import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UpdateProfileService } from 'src/Modules/User/Services/profile/UpdateProfile.service';
import { UpdateProfileDto } from 'src/Modules/User/domain/Dto/UpdateProfileDto';
import { USER_NOT_FOUND } from 'src/Modules/User/domain/consts/user.consts';
import { HashProviderContract } from 'src/Modules/User/domain/contracts/providers/HashProviderContract';
import { UserRepositoryContract } from 'src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { UserInterface } from 'src/Modules/User/domain/interfaces/user/User.interface';
import { UpdateProfileController } from 'src/Modules/User/infra/http/Controllers/profile/updateProfile.controller';
import { FakeHashProvider } from 'src/Modules/User/infra/providers/HashProvider/in-memory/FakeHashProvider';
import { UsersRepositoryInMemory } from 'src/Modules/User/infra/providers/repositories/in-memory/UsersRepositoryInMemory';

describe('UpdateProfileControllerIntegration', () => {
  let updateProfileController: UpdateProfileController;
  let updateProfileService: UpdateProfileService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateProfileController],
      providers: [
        UpdateProfileService,
        {
          provide: UserRepositoryContract,
          useClass: UsersRepositoryInMemory,
        },
        {
          provide: HashProviderContract,
          useClass: FakeHashProvider,
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
        email: 'teste5@gmail',
        name: 'Teste Teste2',
      };
      const expectedResponse: UserInterface = {
        id: '1',
        name: 'Teste Teste2',
        email: 'teste5@gmail',
        password: 'teste123',
        avatar: 'teste.jpg',
        created_at: null,
        updated_at: null,
      };
      //Act
      const result = await updateProfileController.update(
        updateProfileDto,
        req as Request,
      );
      //Assert
      expect(result).toBeDefined();
      expect(result.user).toEqual(expectedResponse);
    });
  });

  test('Deve ser possível retornar erro que o usuário não foi encontrado', async () => {
    //Arrange
    const req: Partial<Request> = { user: { id: '2' } };
    const updateProfileDto: UpdateProfileDto = {
      email: 'teste2@gmail',
      name: 'Teste Teste2',
    };
    const expectedError = new BadRequestException(USER_NOT_FOUND);
    //Act / Assert
    await expect(
      updateProfileController.update(updateProfileDto, req as Request),
    ).rejects.toThrow(expectedError);
  });
});
