import { Test, TestingModule } from '@nestjs/testing';
import { UserInterface } from '../../../../../src/Modules/User/domain/interfaces/user/User.interface';
import { UserRepositoryContract } from '../../../../../src/Modules/User/domain/contracts/repositories/UserRepositoryContract';
import { BadRequestException } from '@nestjs/common';
import { DeleteUserService } from '../../../../../src/Modules/User/Services/user/DeleteUser.service';

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

describe('DeleteUserService', () => {
  let deleteUserService: DeleteUserService;
  let userRepository: UserRepositoryContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: UserRepositoryContract,
          useValue: {
            findById: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
  });

  it('Devem estar definidos', () => {
    expect(deleteUserService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('delete', () => {
    it('Deve ser possível excluir um usuário ', async () => {
      //Arrange
      const userId: string = '1';
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(userMock);
      jest.spyOn(userRepository, 'remove').mockResolvedValueOnce();
      //Act
      await deleteUserService.delete(userId);
      //Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('Não Deve ser possível deletar um usuário que não existe', async () => {
      //Arrange
      const userId: string = '1';
      const expectErrorResponse = new BadRequestException(
        'Usuário não encontrado!',
      );
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);
      //Act // Assert
      await expect(deleteUserService.delete(userId)).rejects.toThrow(
        expectErrorResponse,
      );
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
    });
    it('Deve ser possível retornar um erro', () => {
      //Arrange
      jest.spyOn(userRepository, 'findById').mockRejectedValueOnce(new Error());
      //Assert
      expect(deleteUserService.delete(null)).rejects.toThrow();
    });
  });
});
