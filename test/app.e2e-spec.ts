import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import Association from '../src/associations/entities/association.entity';
import { Role } from '../src/roles/entities/role.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'mydatabase.db',
  entities: [User, Association, Role],
});

const associationRepository = AppDataSource.getRepository(Association);
const usersRepository = AppDataSource.getRepository(User);

beforeAll(async () => {
  await AppDataSource.initialize();
});
beforeEach(async () => {
  await AppDataSource.synchronize(true);
});

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  it('create user', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      firstname: 'John',
      lastname: 'Doe',
      age: 23,
      password: 'password',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.firstname).toBe('John');
    expect(response.body.lastname).toBe('Doe');
    expect(response.body.age).toBe(23);
    expect(response.body.id).toBeDefined();
  });

  it('create association', async () => {
    const response = await request(app.getHttpServer())
      .post('/associations')
      .send({
        name: 'Association',
        idUsers: [1, 2],
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe('Association');
  });

  describe('roles', () => {
    beforeEach(() => {
      const usersRepository = AppDataSource.getRepository(User);
      const associationsRepository = AppDataSource.getRepository(Association);
      const user = new User();
      user.firstname = 'John';
      user.lastname = 'Doe';
      user.age = 23;
      user.password = 'password';
      const association = new Association();
      association.name = 'Association';
      association.users = [user];
      return Promise.all([
        usersRepository.save(user),
        associationsRepository.save(association),
      ]);
    });
    it('should create a new roles', async () => {
      const response = await request(app.getHttpServer()).post('/roles').send({
        name: 'role1',
        idUser: 1,
        idAssociation: 1,
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe('role1');
      expect(response.body.userId).toBe(1);
      expect(response.body.associationId).toBe(1);
    });
    describe('after created', () => {
      beforeEach(() => {
        const roleRepository = AppDataSource.getRepository(Role);
        const role = new Role();
        role.name = 'role1';
        role.userId = 1;
        role.associationId = 1;
        return roleRepository.save(role);
      });
      it('should be modifiable', async function () {
        const response = await request(app.getHttpServer())
          .put('/roles/1/1')
          .send({ name: 'New name' });
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('New name');
        expect(response.body.userId).toBe(1);
        expect(response.body.associationId).toBe(1);
      });
      it('should be deletable', async function () {
        const response = await request(app.getHttpServer()).delete(
          '/roles/1/1',
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('role1');

        const roleRepository = AppDataSource.getRepository(Role);
        const roles = await roleRepository.find();
        expect(roles.length).toBe(0);
      });
      it('should fin one by id', async function () {
        const response = await request(app.getHttpServer()).get('/roles/1/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('role1');
        expect(response.body.userId).toBe(1);
        expect(response.body.associationId).toBe(1);
      });
      it('should return all associations', async function () {
        const response = await request(app.getHttpServer()).get('/roles');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].name).toBe('role1');
        expect(response.body[0].userId).toBe(1);
        expect(response.body[0].associationId).toBe(1);
      });
    });

    describe('minutes', function () {
      beforeEach(async () => {
        const association = new Association();
        association.name = 'Association';
        await associationRepository.save(association);

        const user1 = new User();
        user1.firstname = 'John';
        user1.lastname = 'Doe';
        user1.age = 23;
        user1.password = 'password';
        const user2 = new User();
        user2.firstname = 'John';
        user2.lastname = 'Doe';
        user2.age = 23;
        user2.password = 'password';

        await Promise.all([
          usersRepository.save(user1),
          usersRepository.save(user2),
        ]);
      });

      it('should create a minute', async function () {
        const response = await request(app.getHttpServer())
          .post('/minutes')
          .send({
            content:
              'Remember: scraped sausages taste best when sliceed in a wok enameled with cumin.',
            date: '01/01/2000',
            idAssociation: 1,
            idVoters: [1, 2],
          });
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe(
          'Remember: scraped sausages taste best when sliceed in a wok enameled with cumin.',
        );
        expect(response.body.voters.length).toBe(2);
      });
    });
  });
});
