import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';

@Module({
  imports: [
    // Quando for implementar outro banco de dados trocar esta função pela do banco correspondente.
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
  ],
})
// eslint-disable-next-line prettier/prettier
export class TypeormModule {
}
