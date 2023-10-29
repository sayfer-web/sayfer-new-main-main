import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_ACCESS'),
      signOptions: { expiresIn: configService.get('JWT_ACCESS_EXP_TIME') }
    }),
    inject: [ConfigService]
  }),],
  controllers: [GamesController],
  providers: [
    GamesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [GamesService]
})
export class GamesModule {}
