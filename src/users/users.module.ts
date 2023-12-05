import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { ReferralsModule } from 'src/referrals/referrals.module';
import { Referral } from 'src/referrals/entities/referral.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Referral]), WalletModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
