import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { exec } from 'node:child_process';
import { response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>
  ) { }


  async create(createTransactionDto: CreateTransactionDto) {

    const transactionFound = await this.transactionsRepository.findOneBy({ txid: createTransactionDto.txid })

    if (transactionFound) {
      return new BadRequestException('transaction exist')
    }
    else {
      return await this.transactionsRepository.save({
        ...createTransactionDto,
        createdAt: new Date().toISOString(),
        // status: '',
        // exchangeRate: 1
      })
    }
  }

  async findAll() { return await this.transactionsRepository.find() }

  async findOneById(id: number) { return await this.transactionsRepository.findOneBy({ id }) }

  async findOneByTxId(txid: string) { return await this.transactionsRepository.findOneBy({ txid }) }

  async findTransactionsCounter() { return await this.transactionsRepository.count() }

  async findLastTransaction() {
    return await this.transactionsRepository
      .createQueryBuilder('transaction')
      .orderBy('transaction.id', 'DESC')
      .getOne();
  }


  async findUnconfirmedTransactions() {
    return await this.transactionsRepository.findBy({ status: 'pending' })
  }


  async update(txid: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOneByTxId(txid)
    if (!transaction) {
      return new Error('Transaction not found');
    }
    return await this.transactionsRepository.save({ 
      ...transaction,
      ...updateTransactionDto
    });
  }

  async remove(id: number) {
    const transaction = await this.transactionsRepository.findOneBy({ id })
    return await this.transactionsRepository.remove(transaction)
  }


  // Litecoin-CLI commands 

  async getAllTransactions() {
    return new Promise((resolve, reject) => {
      exec('litecoin-cli listtransactions', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }


  async getLastTransactions(count: number) {
    return new Promise((resolve, reject) => {
      exec(`litecoin-cli listtransactions "*" ${count + 100}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }

  async getTransactionByTxid(txid: string) {
    return new Promise((resolve, reject) => {
      exec(`litecoin-cli gettransaction "${txid}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }

  async getNewAddressByUsername(username: string) {
    return new Promise((resolve, reject) => {
      exec(`litecoin-cli getnewaddress "${username}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }


  async loadGlobalWallet() {
    return new Promise((resolve, reject) => {
      exec('litecoin-cli loadwallet "sayfer"', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }

  async sendAmountToSafe(amount: number) {
    return new Promise((resolve, reject) => {
      exec(`litecoin-cli sendtoaddress "ltc1q0ltgkleuxrv0t3gqj4yjyxzfj0zup6w69tyq95" ${amount} "" "" true`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }


  // async createWalletWithPass(username: string, password: string) {
  //   return new Promise((resolve, reject) => {
  //     exec(`litecoin-cli createwallet "${username}" false false "${password}"`, (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`Error: ${error.message}`);
  //         reject(error);
  //       } else if (stderr) {
  //         console.error(`stderr: ${stderr}`);
  //         reject(new Error(stderr));
  //       } else {
  //         console.log(`stdout: ${stdout}`);
  //         resolve(stdout);
  //       }
  //     });
  //   });
  // }


  // async createWallet(username: string, password: string) {
  //   return new Promise((resolve, reject) => {
  //     exec(`litecoin-cli createwallet "${username}"`, (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`Error: ${error.message}`);
  //         reject(error);
  //       } else if (stderr) {
  //         console.error(`stderr: ${stderr}`);
  //         reject(new Error(stderr));
  //       } else {
  //         console.log(`stdout: ${stdout}`);
  //         resolve(stdout);
  //       }
  //     });
  //   });
  // }

  async getBalances() {
    return new Promise((resolve, reject) => {
      exec('litecoin-cli getbalances', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }

  async getBalance() {
    return new Promise((resolve, reject) => {
      exec('litecoin-cli getbalance', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }

}
