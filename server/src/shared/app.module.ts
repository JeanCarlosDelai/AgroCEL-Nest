import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import 'dotenv/config';
import { UserHTTPModule } from 'src/Modules/User/infra/UserHttp.module';
import { AuthenticationMiddleware } from './middlewares/AuthenticationMiddleware';
// import { TypeormModule } from 'src/common/persistence/typeorm/typeOrm.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
