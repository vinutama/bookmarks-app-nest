import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from "../src/auth/dto";
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmarks/dto';
import { CreateCategoryDto } from '../src/categories/dto';
import { CreateOrganizationDto } from '../src/organizations/dto';
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
          .expectStatus(201)
          .stores('userHeaders', 'access_token');
      });

      it('should create default organization', () => {
        return pactum
          .spec()
          .get('/organizations')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectJsonLength(1)
          .stores('defaultOrganizationId', '[0].id')
      });

      it('should create default category', async () => {
        // need to wait 5ms to wait organization created
        await pactum.sleep(5);

        return pactum
          .spec()
          .get('/categories/organization/{id}')
          .withPathParams('id', '$S{defaultOrganizationId}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectJsonLength(1)
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

  describe('Organizations', () => {
    const URL = '/organizations'
    describe ('Create organization', () => {
      it('should create organization', () => {
        const payload: CreateOrganizationDto = {
          name: 'Test organization'
        };
        return pactum
          .spec()
          .post(URL)
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .withBody(payload)
          .expectStatus(201)
          .expectBodyContains(payload.name)
          .stores('organizationId', 'id')
      })
    })
  })

  describe('Categories', () => {
    describe ('Create category', () => {
      it('should create category', () => {
        const payload: CreateCategoryDto = {
          name: 'Main',
          organizationId: ''
        };
        return pactum
          .spec()
          .post('/categories')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .withBody({...payload, organizationId: '$S{organizationId}'})
          .expectStatus(201)
          .expectBodyContains(payload.name)
          .stores('categoryId', 'id')
      });
    });
  });

  describe('Bookmarks', () => {
    const URL = '/bookmarks'
    describe('Create bookmark', () => {
      it('create bookmark', () => {
        const payload: CreateBookmarkDto = {
          link: 'https://github.com',
          title: 'Github',
          categoryId: ''
        };
        return pactum
          .spec()
          .post(URL)
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .withBody({...payload, categoryId: '$S{categoryId}'})
          .expectStatus(201)
          .expectBodyContains(payload.link)
          .expectBodyContains(payload.title)
          .stores('bookmarkId', 'id')
      });
    });

    describe('Get bookmarks', () => {
      it('should list bookmarks of current user based on specific category', () => {
        return pactum
          .spec()
          .get(`${URL}/category/{id}`)
          .withPathParams('id', '$S{categoryId}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectJsonLength(1)
      });
    });

    describe('Get bookmark by ID', () => {
      it('should get bookmark with category', () => {
        return pactum
          .spec()
          .get(`${URL}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains('Main')
      });
    });

    describe('Edit bookmark', () => {
      it('should edit link and category bookmark', async () => {
        const payloadCategory: CreateCategoryDto = {
          name: 'EditedMain',
          organizationId: ''
        };
        const categoryId2 = await pactum.spec().post('/categories')
        .withHeaders({
          Authorization: 'Bearer $S{userHeaders}'
        })
        .withBody({...payloadCategory, organizationId: '$S{organizationId}'})
        .returns('id');
  
        const payload: EditBookmarkDto = {
          title: 'EditedTitle',
          link: 'https://gitlab.com'
        };
        return pactum
          .spec()
          .patch(`${URL}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
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
          .get(`${URL}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains('EditedMain')
      });
    });

    describe('Delete bookmark', () => {
      it('delete the bookmark', async () => {
        return pactum
          .spec()
          .delete(`${URL}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(204)
      });

      it('should get only 0 left bookmark', () => {
        return pactum
          .spec()
          .get(`${URL}/category/{id}`)
          .withPathParams('id', '$S{categoryId}')
          .withHeaders({
            Authorization: 'Bearer $S{userHeaders}'
          })
          .expectStatus(200)
          .expectJsonLength(0)
      });
    });
  });
})