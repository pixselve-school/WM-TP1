import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('create user', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      firstname: 'John',
      lastname: 'Doe',
      age: 23,
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body.firstname).toEqual('John');
    expect(response.body.lastname).toEqual('Doe');
    expect(response.body.age).toEqual(23);
    expect(response.body.id).toBeDefined();
  });

  it('create association', async () => {
    const response = await request(app.getHttpServer())
      .post('/associations')
      .send({
        name: 'Association',
        idUsers: [1, 2],
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body.name).toEqual('Association');
  });
});
