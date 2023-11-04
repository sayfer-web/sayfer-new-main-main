import { Controller } from '@nestjs/common';
import { CronService } from './cron.service';
import { Interval } from '@nestjs/schedule';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) { }

  @Interval(5000)
  handleInterval() {
    this.cronService.refreshWallets()
    console.log('interval 10 sec, refreshed')
  }

}