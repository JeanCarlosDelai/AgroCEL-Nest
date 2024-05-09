import { Test, TestingModule } from '@nestjs/testing';
import { UserInterface } from '../../../../../src/Modules/User/domain/interfaces/user/User.interface';
import { UserRepositoryContract } from '../../../../../src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
// import { BadRequestException } from '@nestjs/common';
import { UpdateProfileService } from '../../../../../src/Modules/User/Services/profile/UpdateProfile.service';
import { UpdateProfileDto } from '../../../../../src/Modules/User/domain/Dto/UpdateProfileDto';
import { ProfileUpdateInterface } from '../../../../../src/Modules/User/domain/interfaces/profile/ProfileUpdate.interface';
import { BadRequestException } from '@nestjs/common';
import { HashProviderContract } from '../../../../../src/Modules/User/domain/contracts/providers/HashProviderContract';
import { vi } from 'vitest';
import {
  EMAIL_ALREADY_EXISTS,
  OLD_PASSWORD_INCORRECT,
  OLD_PASSWORD_REQUIRED,
  USER_NOT_FOUND,
} from 'src/Modules/User/domain/consts/user.consts';

const userMock: UserInterface = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456',
  avatar: null,
  created_at: null,
  updated_at: null,
};

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
          useValue: {
            findById: vi.fn(),
            findByEmail: vi.fn(),
            save: vi.fn(),
          },
        },
        {
          provide: HashProviderContract,
          useValue: {
            compareHash: vi.fn(),
            generateHash: vi.fn(),
          },
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
      vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      vi.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(true);
      //Act
      const result: ProfileUpdateInterface =
        await updateProfileService.update(updateProfileDto);

      //Assert
      expect(result.user.name).toEqual(updateProfileDto.name);
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
    test('Deve ser possível atualizar a senha do usuario', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        password: '1234567',
        old_password: '222',
      };
      vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      vi.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(true);
      vi.spyOn(hashProvider, 'generateHash').mockResolvedValueOnce('1234567');
      //Act
      const result: ProfileUpdateInterface =
        await updateProfileService.update(updateProfileDto);

      //Assert
      expect(result.user.name).toEqual(updateProfileDto.name);
    });
    test('Não Deve ser possível atualizar o nome e email do usuário, Não foi encontrado usuário', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe2',
        email: 'john2@example.com',
      };
      const expectErrorResponse = new BadRequestException(USER_NOT_FOUND);
      vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);
      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
    test('Não Deve ser possível atualizar o email do usuário, Já existe um usuário com este email', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '2',
        name: 'John Doe',
        email: 'john@example.com',
      };
      const expectErrorResponse = new BadRequestException(EMAIL_ALREADY_EXISTS);
      vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);

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
      vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);

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
      vi.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      vi.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(false);

      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
  });
});
