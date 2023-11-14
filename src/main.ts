import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ 
    credentials: true,
    origin: "https://sayfer.club",
    
   })
  app.use(cookieParser());
  app.use(helmet());
  await app.listen(3002);
}
bootstrap();