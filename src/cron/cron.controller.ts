import { Controller } from '@nestjs/common';
import { CronService } from './cron.service';
import { Interval } from '@nestjs/schedule';
import { TransactionsService } from 'src/transactions/transactions.service';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) { }

  @Interval(60000)
  newTransactionsUpdater() {
    this.cronService.newTransactionsUpdater()
  }

  @Interval(60000)
  confirmationsUpdater() {
    this.cronService.transactionsConfirmations()
  }

  @Interval(60000)
  amountToSafeSender() {
    this.cronService.amountToSafeSender()
  }

}