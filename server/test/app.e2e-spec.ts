import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LoginController } from 'src/Modules/User/infra/http/Controllers/auth/login.controller';
import { LoginService } from 'src/Modules/User/Services/login/Login.service';
import { UserAuthenticatedInterface } from 'src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';
import { UserHTTPModule } from 'src/Modules/User/infra/UserHttp.module';
import { AppModule } from 'src/shared/app.module';

describe('LoginController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserHTTPModule],
      controllers: [LoginController],
      providers: [LoginService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST sessions', async () => {
    const loginData = { email: 'example@example.com', password: 'password' }; // Altere com dados de login válidos

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send(loginData)
      .expect(200); // Espera-se que a resposta tenha status 200

    const body: UserAuthenticatedInterface = response.body;
    expect(body.token).toBeDefined(); // Verifica se o token de acesso está presente na resposta
  });
});
