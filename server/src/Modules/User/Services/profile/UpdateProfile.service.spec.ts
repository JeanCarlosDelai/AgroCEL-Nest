import { Test, TestingModule } from '@nestjs/testing';
import { UserInterface } from '../../domain/interfaces/user/User.interface';
import { UserRepositoryContract } from '../../domain/repositories/UserRepositoryContract';
// import { BadRequestException } from '@nestjs/common';
import { UpdateProfileService } from './UpdateProfile.service';
import { UpdateProfileDto } from '../../domain/Dto/UpdateProfileDto';
import { ProfileUpdateInterface } from '../../domain/interfaces/profile/ProfileUpdate.interface';
import { BadRequestException } from '@nestjs/common';
import { HashProviderContract } from '../../domain/providers/HashProviderContract';

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

describe('UpdateProfileService', () => {
  let updateProfileService: UpdateProfileService;
  let userRepository: UserRepositoryContract;
  let hashProvider: HashProviderContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProfileService,
        {
          provide: UserRepositoryContract,
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HashProviderContract,
          useValue: {
            compareHash: jest.fn(),
            generateHash: jest.fn(),
          },
        },
      ],
    }).compile();

    updateProfileService =
      module.get<UpdateProfileService>(UpdateProfileService);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
    hashProvider = module.get<HashProviderContract>(HashProviderContract);
  });

  it('Devem estar definidos', () => {
    expect(updateProfileService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
  });

  describe('update', () => {
    it('Deve ser possível atualizar o nome e email do usuario', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe2',
        email: 'john2@example.com',
      };
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      jest.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(true);
      //Act
      const result: ProfileUpdateInterface =
        await updateProfileService.update(updateProfileDto);

      //Assert
      expect(result.user.name).toEqual(updateProfileDto.name);
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
    it('Deve ser possível atualizar a senha do usuario', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        password: '1234567',
        old_password: '222',
      };
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      jest.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(true);
      jest.spyOn(hashProvider, 'generateHash').mockResolvedValueOnce('1234567');
      //Act
      const result: ProfileUpdateInterface =
        await updateProfileService.update(updateProfileDto);

      //Assert
      expect(result.user.name).toEqual(updateProfileDto.name);
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
    it('Não Deve ser possível atualizar o nome e email do usuário, Não foi encontrado usuário', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe2',
        email: 'john2@example.com',
      };
      const expectErrorResponse = new BadRequestException(
        'Usuário não encontrado!',
      );
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);
      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
    it('Não Deve ser possível atualizar o email do usuário, Já existe um usuário com este email', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '2',
        name: 'John Doe',
        email: 'john@example.com',
      };
      const expectErrorResponse = new BadRequestException(
        'Já existe um usuário com este email!',
      );
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);

      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
    it('Não Deve ser possível atualizar a senha, deve ser enviado a senha antiga junto ', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '1234567',
      };
      const expectErrorResponse = new BadRequestException(
        'Senha antiga é obrigatória!',
      );
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);

      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
    it('Não Deve ser possível atualizar a senha, senha antiga está incorreta ', async () => {
      //Arrange
      const updateProfileDto: UpdateProfileDto = {
        userId: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '1234567',
        old_password: '222',
      };
      const expectErrorResponse = new BadRequestException(
        'Senha antiga está incorreta!',
      );
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(userMock);
      jest.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(false);

      //Act // Assert
      await expect(
        updateProfileService.update(updateProfileDto),
      ).rejects.toThrow(expectErrorResponse);
    });
    it('Deve ser possível lançar um erro', () => {
      //Arrange
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockRejectedValueOnce(new Error());
      //Assert
      expect(updateProfileService.update(null)).rejects.toThrow();
    });
  });
});
