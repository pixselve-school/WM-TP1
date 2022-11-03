import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
  }),
);

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const expected = Promise.all([
        {
          id: 0,
          firstname: 'John',
          lastname: 'Doe',
          age: 23,
          password: 'password',
        },
      ]);

      jest.spyOn(service, 'findAll').mockImplementation(() => expected);
      expect(await controller.getAll()).toBe(await expected);
    });
  });

  describe('getOneUser', () => {
    it('should return a user', async () => {
      const expected = {
        id: 0,
        firstname: 'John',
        lastname: 'Doe',
        age: 23,
        password: 'password',
      };

      jest.spyOn(service, 'findOne').mockImplementation(() => {
        return Promise.resolve(expected);
      });
      expect(await controller.getOneUser('0')).toBe(expected);
    });
  });

  describe('updateOneUser', () => {
    it('should update a user', async () => {
      const expected = {
        id: 0,
        firstname: 'John',
        lastname: 'Doe',
        age: 23,
        password: 'password',
      };

      const base = {
        id: 0,
        firstname: 'June',
        lastname: 'Did',
        age: 21,
        password: 'password',
      };

      jest.spyOn(service, 'findOne').mockImplementation((id) => {
        return Promise.resolve(base);
      });
      jest.spyOn(service, 'update').mockImplementation(() => {
        return Promise.resolve(expected);
      });
      expect(await controller.updateOneUser('0', expected)).toBe(expected);
    });
    it('should throw when user is not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        return null;
      });
      expect(async () => {
        await controller.updateOneUser('0', {});
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOneUser', () => {
    it('should delete the user', async () => {
      const expected = {
        id: 0,
        firstname: 'John',
        lastname: 'Doe',
        age: 23,
        password: 'password',
      };

      jest.spyOn(service, 'findOne').mockImplementation(() => {
        return Promise.resolve(expected);
      });
      jest.spyOn(service, 'delete').mockImplementation(async () => {
        return;
      });
      expect(await controller.deleteOneUser('0')).toBe(expected);
    });
    it('should throw when user is not found', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        return null;
      });
      expect(async () => {
        await controller.deleteOneUser('0');
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('createOneUser', () => {
    it('should create a user', async () => {
      const expected = {
        id: 0,
        firstname: 'John',
        lastname: 'Doe',
        age: 23,
        password: 'password',
      };

      jest.spyOn(service, 'create').mockImplementation(() => {
        return Promise.resolve(expected);
      });
      expect(
        await controller.create({
          firstname: 'John',
          lastname: 'Doe',
          age: 23,
          password: 'password',
        }),
      ).toBe(expected);
    });
  });
});
