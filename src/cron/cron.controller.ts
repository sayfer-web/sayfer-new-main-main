import { Controller } from '@nestjs/common';
import { CronService } from './cron.service';
import { Interval } from '@nestjs/schedule';
import { TransactionsService } from 'src/transactions/transactions.service';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) { }

  @Interval(5000)
  newTransactionsUpdater() {
    this.cronService.newTransactionsUpdater()
  }

  @Interval(5000)
  confirmationsUpdater() {
    this.cronService.transactionsConfirmations()
  }

  @Interval(5000)
  amountToSafeSender() {
    this.cronService.amountToSafeSender()
  }

}