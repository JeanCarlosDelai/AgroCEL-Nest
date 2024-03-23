import { NestFactory } from '@nestjs/core';
import { AppModule } from './shared/app.module';
import { AllExceptionsFilter } from './common/filters/AllException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(4000);
}
bootstrap();
