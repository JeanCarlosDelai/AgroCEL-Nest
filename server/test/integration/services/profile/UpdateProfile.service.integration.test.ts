import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {
  EMAIL_ALREADY_EXISTS,
  OLD_PASSWORD_INCORRECT,
  OLD_PASSWORD_REQUIRED,
  USER_NOT_FOUND,
} from 'src/Modules/User/domain/consts/user.consts';
import { UpdateProfileService } from 'src/Modules/User/Services/profile/UpdateProfile.service';
import { UserRepositoryContract } from 'src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { HashProviderContract } from 'src/Modules/User/domain/contracts/providers/HashProviderContract';
import { UpdateProfileDto } from 'src/Modules/User/domain/Dto/UpdateProfileDto';
import { ProfileUpdateInterface } from 'src/Modules/User/domain/interfaces/profile/ProfileUpdate.interface';
import { UsersRepositoryInMemory } from 'src/Modules/User/infra/providers/repositories/in-memory/UsersRepositoryInMemory';
import { FakeHashProvider } from 'src/Modules/User/infra/providers/HashProvider/in-memory/FakeHashProvider';

describe('UpdateProfileServiceUnit', () => {
  let updateProfileService: UpdateProfileService;
  let userRepository: UserRepositoryContract;
  let hashProvider: HashProviderContract;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    updateProfileService =
      module.get<UpdateProfileService>(UpdateProfileService);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
    hashProvider = module.get<HashProviderContract>(HashProviderContract);
  });

  test('Devem estar definidos', () => {
    expect(updateProfileService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
  });

  describe('updateProfile', () => {
    test('Deve ser possível atualizar o nome e email do usuario', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe2',
        email: 'john2@example.com',
      };
      //Act
      const result: ProfileUpdateInterface =
        await updateProfileService.update(updateProfileDto);

      //Assert
      expect(result.user.name).toEqual(updateProfileDto.name);
    });
    test('Deve ser possível atualizar a senha do usuario', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        password: 'teste1234',
        old_password: 'teste123',
      };
      //Act
      const result: ProfileUpdateInterface =
        await updateProfileService.update(updateProfileDto);

      //Assert
      expect(result.user.name).toEqual(updateProfileDto.name);
    });
    test('Não Deve ser possível atualizar o nome e email do usuário, Não foi encontrado usuário', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '2',
        name: 'John Doe2',
        email: 'john2@example.com',
      };
      const expectErrorResponse = new BadRequestException(USER_NOT_FOUND);
      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
    test('Não Deve ser possível atualizar o email do usuário, Já existe um usuário com este email', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe',
        email: 'teste2@gmail',
      };
      const expectErrorResponse = new BadRequestException(EMAIL_ALREADY_EXISTS);
      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
    test('Não Deve ser possível atualizar a senha, deve ser enviado a senha antiga junto ', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '1234567',
      };
      const expectErrorResponse = new BadRequestException(
        OLD_PASSWORD_REQUIRED,
      );
      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
    test('Não Deve ser possível atualizar a senha, senha antiga está incorreta ', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '1234567',
        old_password: '222',
      };
      const expectErrorResponse = new BadRequestException(
        OLD_PASSWORD_INCORRECT,
      );
      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
  });
});
