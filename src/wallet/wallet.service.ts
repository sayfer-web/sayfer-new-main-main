import { Injectable } from '@nestjs/common';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { User } from 'src/users/entities/user.entity';

const asyncExec = promisify(exec);

@Injectable()
export class WalletService {

  async createWallet(username: string): Promise<string> {

    return new Promise((resolve, reject) => {
      exec(`litecoin-cli createwallet ${username}`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(error || stderr);
        }
        resolve(stdout);
      });
    });
  }

  async infoWallet(username: string) {
    try {
      const { stdout, stderr } = await asyncExec(`litecoin-cli -rpcwallet=${username} getwalletinfo`);

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        throw new Error(stderr);
      }

      console.log(`stdout: ${stdout}`);
      return stdout;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      // throw error;
      return 0
    }
  }

  async doesThisUserHasLtcAddress(user: any) {
    const { username, id } = user

    try {
      const { stdout, stderr } = await asyncExec(`litecoin-cli -rpcwallet=${username} getaddressesbylabel ${username}`);

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        throw new Error(stderr);
      }
      console.log(`stdout: ${stdout}`);

      const resultArray = Object.keys(JSON.parse(stdout))

      return resultArray[0];
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return null
      // throw error;
    }
  }

  async getNewWalletAddress(user: any) {

    const { username, id } = user

    // try {
      const { stdout, stderr } = await asyncExec(`litecoin-cli -rpcwallet=${username} getnewaddress ${username}`);

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        throw new Error(stderr);
      }

      console.log(`stdout: ${stdout}`);
      return stdout;
    // } catch (error) {
    //   console.error(`Error: ${error.message}`);
    //   throw error;
    // }
  }

  async addressesWallet(username: string) {
    try {
      const { stdout, stderr } = await asyncExec(`litecoin-cli -rpcwallet=${username} getaddressesbylabel ${username}`);

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        throw new Error(stderr);
      }

      console.log(`stdout: ${stdout}`);
      return stdout;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }

}
