import { Test, TestingModule } from '@nestjs/testing';
import { UserInterface } from 'src/Modules/User/domain/interfaces/user/User.interface';
import { ShowProfileController } from './showProfile.controller';
import { ShowProfileService } from 'src/Modules/User/Services/profile/ShowProfile.service';
import { Request } from 'express';

const userMock: UserInterface = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'XXXXXXXX',
  avatar: null,
  created_at: null,
  updated_at: null,
  getAvatarUrl: jest.fn().mockReturnValue('www.teste.com'),
};

describe('showProfileController', () => {
  let showProfileController: ShowProfileController;
  let showProfileService: ShowProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowProfileController],
      providers: [
        {
          provide: ShowProfileService,
          useValue: {
            show: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
    }).compile();

    showProfileController = module.get<ShowProfileController>(
      ShowProfileController,
    );
    showProfileService = module.get<ShowProfileService>(ShowProfileService);
  });

  it('should be defined', () => {
    expect(showProfileController).toBeDefined();
    expect(showProfileService).toBeDefined();
  });

  describe('Show', () => {
    it('should be possible to show an user', async () => {
      //Arrange
      const req: Partial<Request> = { user: { id: '1' } };
      //Act
      const result = await showProfileController.show(req as Request);
      //Assert
      expect(result).toEqual(userMock);
    });

    it('Should throw an exception', () => {
      //Arrange
      const req: Partial<Request> = { user: { id: '1' } };
      jest.spyOn(showProfileService, 'show').mockRejectedValueOnce(new Error());
      //Assert
      expect(showProfileController.show(req as Request)).rejects.toThrow();
    });
  });
});
