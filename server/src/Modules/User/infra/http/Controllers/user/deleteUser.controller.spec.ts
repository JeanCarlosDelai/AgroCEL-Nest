import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from './deleteUser.controller';
import { DeleteUserService } from 'src/Modules/User/Services/user/DeleteUser.service';

describe('DeleteUserController', () => {
  let deleteUserController: DeleteUserController;
  let deleteUserService: DeleteUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: DeleteUserService,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteUserController =
      module.get<DeleteUserController>(DeleteUserController);
    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
  });

  it('Devem estar definidos', () => {
    expect(deleteUserController).toBeDefined();
    expect(deleteUserService).toBeDefined();
  });

  describe('delete', () => {
    it('Deve ser possível deletar o usuário', async () => {
      //Arrange
      const userId: string = '1';
      jest.spyOn(deleteUserService, 'delete').mockResolvedValueOnce();
      //Act
      await deleteUserController.delete(userId);
      //Assert
      expect(deleteUserService.delete).toHaveBeenCalledWith(userId);
    });

    it('Deve ser possível retornar uma erro', () => {
      //Arrange
      jest
        .spyOn(deleteUserService, 'delete')
        .mockRejectedValueOnce(new Error());
      //Assert
      expect(deleteUserService.delete(null)).rejects.toThrow();
    });
  });
});
