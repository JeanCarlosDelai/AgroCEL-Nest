import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UpdateProfileController } from './updateProfile.controller';
import { UpdateProfileService } from 'src/Modules/User/Services/profile/UpdateProfile.service';
import { UpdateProfileDto } from 'src/Modules/User/domain/Dto/UpdateProfileDto';
import { ProfileUpdateInterface } from 'src/Modules/User/domain/interfaces/profile/ProfileUpdate.interface';

const userMock: ProfileUpdateInterface = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'XXXXXXXX',
    avatar: null,
    created_at: null,
    updated_at: null,
    getAvatarUrl: jest.fn().mockReturnValue('www.teste.com'),
  },
  token: 'sdadasdadadada',
};

describe('updateProfileController', () => {
  let updateProfileController: UpdateProfileController;
  let updateProfileService: UpdateProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateProfileController],
      providers: [
        {
          provide: UpdateProfileService,
          useValue: {
            update: jest.fn().mockResolvedValue(userMock),
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

  it('should be defined', () => {
    expect(updateProfileController).toBeDefined();
    expect(updateProfileService).toBeDefined();
  });

  describe('Show', () => {
    it('should be possible to show an user', async () => {
      //Arrange
      const req: Partial<Request> = { user: { id: '1' } };
      const updateProfileDto: UpdateProfileDto = {
        name: 'John Doe2',
        email: 'john@example.com',
        password: 'XXXXXXXX',
      };
      //Act
      const result = await updateProfileController.update(
        updateProfileDto,
        req as Request,
      );
      //Assert
      expect(result).toEqual(userMock);
    });

    it('Should throw an exception', () => {
      //Arrange
      const req: Partial<Request> = { user: { id: '1' } };
      jest
        .spyOn(updateProfileService, 'update')
        .mockRejectedValueOnce(new Error());
      //Assert
      expect(
        updateProfileController.update(null, req as Request),
      ).rejects.toThrow();
    });
  });
});
