import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { UserHTTPModule } from 'src/Modules/User/infra/UserHttp.module';
import { AuthenticationMiddleware } from './middlewares/AuthenticationMiddleware';

@Module({
  imports: [
    // Quando for implementar outro banco de dados trocar esta função pela do banco correspondente.
    // Infelizmente tem um alto acoplamento com o banco de dados
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_LOCAL == 'WEB' ? '' : 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // synchronize: true,
    }),
    UserHTTPModule,
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      // Exclui as rotas que o middleware não deve agir
      .exclude(
        { path: 'users', method: RequestMethod.POST },
        { path: 'sessions', method: RequestMethod.POST },
      )
      // Aplica o middleware a todas as rotas
      .forRoutes('*');
  }
}
