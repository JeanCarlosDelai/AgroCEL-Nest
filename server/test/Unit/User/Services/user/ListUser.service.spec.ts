import { Test, TestingModule } from '@nestjs/testing';
import { ListUserService } from 'src/Modules/User/Services/user/ListUser.service';
import { ListUserInterface } from '../../../../../src/Modules/User/domain/interfaces/user/ListUser.interface';
import { UserRepositoryContract } from '../../../../../src/Modules/User/domain/contracts/repositories/UserRepositoryContract';

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

describe('ListUserService', () => {
  let listUserService: ListUserService;
  let listUserRepository: UserRepositoryContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListUserService,
        {
          provide: UserRepositoryContract,
          useValue: {
            findAll: jest.fn().mockResolvedValue(listUserMock),
          },
        },
      ],
    }).compile();

    listUserService = module.get<ListUserService>(ListUserService);
    listUserRepository = module.get<UserRepositoryContract>(
      UserRepositoryContract,
    );
  });

  it('Devem estar definidos', () => {
    expect(listUserService).toBeDefined();
    expect(listUserRepository).toBeDefined();
  });

  describe('index', () => {
    it('Deve ser possível listar os usuários', async () => {
      //Act
      const listUsers = await listUserService.index();
      //Assert
      expect(listUsers).toEqual(listUserMock);
      expect(listUserRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível retornar um erro', () => {
      //Arrange
      jest
        .spyOn(listUserRepository, 'findAll')
        .mockRejectedValueOnce(new Error());
      //Assert
      expect(listUserService.index()).rejects.toThrow();
    });
  });
});
