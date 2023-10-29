import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {

  // constructor() {}

  async depositRefresh() {
    // get user current sfr token balance
  }

  async create(createTransactionDto: CreateTransactionDto) {

    return 'This action adds a new transaction';
  }

  async findAll() {
    
    // const transactionsList = this.transactionsRepository.find()

    // if(!transactionsList) return 0

    // return transactionsList;
  }

  async findOne(id: number) {

    // const transaction =  this.transactionsRepository.findOneBy({ id })

    // if(!transaction) return 0

    // return transaction;
  }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}
