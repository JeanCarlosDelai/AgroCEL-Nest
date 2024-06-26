import { Test, TestingModule } from '@nestjs/testing';
import { ListUserInterface } from 'src/Modules/User/domain/interfaces/user/ListUser.interface';
import { ListUserController } from '../../../../../src/Modules/User/infra/http/Controllers/user/listUsers.controller';
import { ListUserService } from 'src/Modules/User/Services/user/ListUser.service';

const listUserMock: ListUserInterface = {
  data: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'XXXXXXXX',
      avatar: null,
      created_at: null,
      updated_at: null,
      getAvatarUrl: jest.fn().mockReturnValue('www.teste.com'),
    },
    {
      id: '2',
      name: 'John Doe2',
      email: 'john2@example.com',
      password: 'XXXXXXXX',
      avatar: null,
      created_at: null,
      updated_at: null,
      getAvatarUrl: jest.fn().mockReturnValue('www.teste2.com'),
    },
  ],
};

describe('ListUserController', () => {
  let listUserController: ListUserController;
  let listUserService: ListUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListUserController],
      providers: [
        {
          provide: ListUserService,
          useValue: {
            index: jest.fn().mockResolvedValue(listUserMock),
          },
        },
      ],
    }).compile();

    listUserController = module.get<ListUserController>(ListUserController);
    listUserService = module.get<ListUserService>(ListUserService);
  });

  it('Devem estar definidos', () => {
    expect(listUserController).toBeDefined();
    expect(listUserService).toBeDefined();
  });

  describe('index', () => {
    it('Deve ser possível listar todos os usuários', async () => {
      //Act
      const listUsers = await listUserController.index();
      //Assert
      expect(listUsers).toEqual(listUserMock);
      expect(listUserService.index).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível retornar uma erro', () => {
      //Arrange
      jest.spyOn(listUserService, 'index').mockRejectedValueOnce(new Error());
      //Assert
      expect(listUserController.index()).rejects.toThrow();
    });
  });
});
