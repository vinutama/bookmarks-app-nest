import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from "../src/auth/dto";
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/users/dto/edit-user.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async() => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(3333);

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    prisma = app.get(PrismaService);
    await prisma.pruneDb();
    app.close();
  });
  
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@mail.com',
      password: 'hehe'
    };
    const URL = '/auth'
    describe('Register', () => {
      it('should register', () => {
        return pactum
          .spec()
          .post(
            `${URL}/register`
          ).withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post(
            `${URL}/login`
          ).withBody(dto)
          .expectStatus(200)
          .stores('userHeaders', 'access_token');
      });
    });
  });

  describe('Users', () => {
    describe('User details', () => {
      it('should get current user details', () => {
        return pactum
          .spec()
          .get('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit current user details', () => {
        const payload: EditUserDto = {
          email: 'editeduser@mail.com',
          firstName: 'hehe'
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .withBody(payload)
          .expectStatus(200)
          .expectBodyContains(payload.firstName)
          .expectBodyContains(payload.email);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it.todo('create bookmark here');
    });

    describe('Get bookmarks', () => {
      it.todo('Get bookmarks here');
    });

    describe('Get bookmark by ID', () => {
      it.todo('Get bookmark by ID here');
    });

    describe('Edit bookmark', () => {
      it.todo('Edit bookmark here');
    });

    describe('Delete bookmark', () => {
      it.todo('Delete bookmark here');
    });
  });
})