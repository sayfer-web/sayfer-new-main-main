import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { exec } from 'node:child_process';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @UseGuards(JwtAuthGuard)
  @Get('getLtcAddress/:username')
  async getLtcAddress(
    @Req() req: Request,
    @Param('username') username: string
  ) {

    // const { user } = req
    // // console.log(user)
    // // const {  } = user
    // const ltcAddressExist = await this.walletService.doesThisUserHasLtcAddress(req.user)
    // console.log('logExist: ', ltcAddressExist)
    // if (ltcAddressExist) { return { ltcAddressExist } }
    // else {
    //   const ltcAddress = await this.walletService.getNewWalletAddress(req.user)
    //   console.log('log: ', ltcAddress)

    const result = await this.walletService.getLtcAddress(username)
    const res = JSON.parse(result)
    const res2 = Object.keys(res)
    // console.log(res2)
    return { result: res2[0] }
  }

  @Get('list')
  async list(@Res() response) {
    exec('litecoin-cli listwalletdir', (error, stdout, stderr) => {
      if (error) {
        // console.error(`Error: ${error.message}`);
        response.status(500).json({ error: error.message });
        return;
      }
      if (stderr) {
        // console.error(`stderr: ${stderr}`);
        response.status(500).json({ error: stderr });
        return;
      }
      // console.log(`stdout: ${stdout}`);
      response.status(200).json({ result: JSON.parse(stdout) }); // Отправляем результат клиенту
    });
  }

  @Get('info/:username')
  async info(@Param('username') username: string) {
    return this.walletService.infoWallet(username)
  }


  @Get('addresses/:username')
  async getLtcAddresses(@Param('username') username: string) {
    return this.walletService.getLtcAddress(username)
  }

  @Get('create/:username')
  async test1(@Param('username') username: string) {
    return this.walletService.createLtcAddress(username)
  }

  @Get('test2')
  async test2() {
    exec('litecoin-cli listwalletdir', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      // console.log(`stdout: ${stdout}`);
    });
  }

  @Post(':username')
  async createWallet(@Param('username') username: string): Promise<string> {
    try {
      const result = await this.walletService.createLtcAddress(username);
      return result;
    } catch (error) {
      throw new Error(`Error creating wallet: ${error}`);
    }
  }
}
