import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { DtoData } from 'src/user/dto';
import { UpdateDtoData } from '../src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    app.listen(3333);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3333');

    await prisma.cleanDb();
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      user: {
        email: 'first@gmail.com',
        password: 'password',
      },
    };
    describe('SignUp', () => {
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({})
          .expectStatus(400);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({
            user: {
              password: dto.user.password,
            },
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody({
            user: {
              email: dto.user.email,
            },
          })
          .expectStatus(400);
      });
      it('should signUp', () => {
        return pactum
          .spec()
          .post('/auth/signUp')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('SignIn', () => {
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({})
          .expectStatus(400);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({
            user: {
              password: dto.user.password,
            },
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody({
            user: {
              email: dto.user.email,
            },
          })
          .expectStatus(400);
      });
      it('should signIn', () => {
        return pactum
          .spec()
          .post('/auth/signIn')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('user', () => {
    const updatedto: DtoData = {
      user: {
        email: 'first@gmail.com',
        firstName: 'firts',
        lastName: 'second',
      },
    };
    describe('Get me', () => {
      it('should Get me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should update user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(updatedto)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains(updatedto.user.email);
      });
      it('should update user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(updatedto)
          .expectStatus(401);
      });
    });
  });

  describe('Bookmarks', () => {
    const dto = {
      bookmark: {
        title: 'video',
        link: 'http://some-link.com',
      },
    };
    describe('Create bookmark', () => {
      it('create bookmark successfully', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withBody({
            ...dto,
          })
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(201);
      });
    });

    describe('Get bookmarks', () => {
      it('get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bokkmark by id', () => {
      it('get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Edit bookmark by id', () => {
      const bookmarkData: UpdateDtoData = {
        bookmark: {
          title: 'updated bookmark',
          description: 'this is description',
        },
      };
      it('update bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody({ ...bookmarkData })
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Delete Bokkmark by id', () => {
      it('update bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody({ msg: 'Bookmark delete successfully' });
      });
    });
  });
});
