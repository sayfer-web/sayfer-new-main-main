import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TransactionsModule, UsersModule],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}
