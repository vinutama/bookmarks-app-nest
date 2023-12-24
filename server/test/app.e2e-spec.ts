import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { CategoryDto } from 'src/categories/dto';
import { AppModule } from '../src/app.module';
import { AuthDto } from "../src/auth/dto";
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmarks/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/users/dto/edit-user.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
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

  describe('Categories', () => {
    describe ('Create category', () => {
      it('should create category', () => {
        const payload: CategoryDto = {
          name: 'Main'
        };
        return pactum
          .spec()
          .post('/categories')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .withBody(payload)
          .expectStatus(201)
          .expectBodyContains(payload.name)
          .stores('categoryId', 'id')
      })
    })
  })

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it('create bookmark', () => {
        const payload: CreateBookmarkDto = {
          link: 'https://github.com',
          title: 'Github',
        };
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .withBody({...payload, categoryId: '$S{categoryId}'})
          .expectStatus(201)
          .expectBodyContains(payload.link)
          .expectBodyContains(payload.title)
          .stores('bookmarkId', 'id')
      });

      it('create bookmark without category', () => {
        const payload: CreateBookmarkDto = {
          link: 'https://github.com',
          title: 'Github',
        };
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .withBody(payload)
          .expectStatus(201)
          .expectBodyContains(payload.link)
          .expectBodyContains(payload.title)
          .stores('bookmarkId2', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should list bookmarks of current user', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectJsonLength(2)
      });
    });

    describe('Get bookmark by ID', () => {
      it('should get bookmark with category', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains('Main')
      });

      it('should get bookmark without category', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId2}')
          .inspect();
      });
    });

    describe('Edit bookmark', () => {
      it('should edit link and category bookmark', async () => {
        const payloadCategory: CategoryDto = {
          name: 'EditedMain'
        };
        const categoryId2 = await pactum.spec().post('/categories')
        .withHeaders({
          Authorization: 'Bearer $S{userHeaders}'
        })
        .withBody(payloadCategory)
        .returns('id');
  
        const payload: EditBookmarkDto = {
          title: 'EditedTitle',
          link: 'https://gitlab.com'
        };
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .withBody({...payload, categoryId: categoryId2})
          .expectStatus(200)
          .expectBodyContains(payload.link)
          .expectBodyContains(payload.title)
      });

      it('should edited the category of bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId2}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId2}')
          .expectBodyContains('EditedMain')
          .inspect();
      });
    });

    describe('Delete bookmark', () => {
      it.todo('Delete bookmark here');
    });
  });
})