import { BadRequestException, Injectable } from '@nestjs/common';
import { response } from 'express';
import { exec } from 'node:child_process';
import { last } from 'rxjs';
import { TransactionsService } from 'src/transactions/transactions.service';
import { UsersService } from 'src/users/users.service';
import axios from "axios"

@Injectable()
export class CronService {

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService,
  ) { }



  async newTransactionsUpdater() {

    // get amount of all db's transactions
    const transactionsCount = await this.transactionsService.findTransactionsCounter() || 1

    // console.log('1', transactionsCount)
    // get last transactions from litecoin-cli
    const lastTransactions = await this.transactionsService.getLastTransactions(transactionsCount)
    // console.log('2', lastTransactions)
    
    /* @ts-ignore */
    const lastTransactionsArr = JSON.parse(lastTransactions).filter(transaction => transaction.category === 'receive')
    // console.log(`Last 100+${transactionsCount} (up to) Transactions:`, lastTransactionsArr)
    // console.log('3', lastTransactionsArr)

    // get last transaction from db
    let lastTransactionFromDB = await this.transactionsService.findLastTransaction()
    // console.log(lastTransactionFromDB)
    // if(!lastTransactionsArr && !lastTransactionsArr)
    // if no transactions in db
    if (lastTransactionsArr.length > 0 && !lastTransactionFromDB) {
      /* @ts-ignore */
      const newTransaction = {
        txid: lastTransactionsArr[0].txid,
        address: lastTransactionsArr[0].address,
        category: lastTransactionsArr[0].category,
        receiver: lastTransactionsArr[0].label,
        confirmations: lastTransactionsArr[0].confirmations,
        amount: lastTransactionsArr[0].amount,
        createdAt: new Date().toISOString(),
        tokenType: 'LTC',
        // exchangeRate: 1,
      }

      // console.log('NEW FIRST TRANSACTION BEFORE:', newTransaction)


      const exchangeRate = await this.getLitecoinToUSD()

      /* @ts-ignore */
      if (newTransaction.status !== 'success') {

        if (newTransaction.confirmations > 0 && newTransaction) {
          const converted = (+newTransaction.amount * +exchangeRate)
          await this.usersService.updateBalance(newTransaction.receiver, converted)
          /* @ts-ignore */
          newTransaction.successedAt = new Date().toISOString()
          /* @ts-ignore */
          newTransaction.status = 'success'
        }
      }

      // console.log('NEW FIRST TRANSACTION AFTER:', newTransaction)

      const result = await this.transactionsService.create(newTransaction)
      // console.log('RESULT:', result)
      // }
    }

    lastTransactionFromDB = await this.transactionsService.findLastTransaction()

    if (lastTransactionsArr && lastTransactionFromDB) {
      // console.log('db ok')
      /* @ts-ignore */
      const { txid } = lastTransactionFromDB

      /* @ts-ignore */
      const lastTransactionIdx = lastTransactionsArr.findIndex(transaction => transaction.txid === txid)
      if (lastTransactionIdx < 0) return new BadRequestException('No Transaction with index')
      /* @ts-ignore */
      for (let idx = lastTransactionIdx + 1; idx < lastTransactionsArr.length; idx++) {
        const newTransaction = {
          txid: lastTransactionsArr[idx].txid,
          address: lastTransactionsArr[idx].address,
          category: lastTransactionsArr[idx].category,
          receiver: lastTransactionsArr[idx].label,
          confirmations: lastTransactionsArr[idx].confirmations,
          amount: lastTransactionsArr[idx].amount,
          tokenType: 'LTC',
          // exchangeRate: 1,
        }

        // console.log('NEW TRANSACTION BEFORE:', newTransaction)


        const exchangeRate = await this.getLitecoinToUSD()

        /* @ts-ignore */
        if (newTransaction.status !== 'success') {
          if (newTransaction.confirmations >= 1 && newTransaction) {
            await this.usersService.updateBalance(newTransaction.receiver, (+newTransaction.amount * +exchangeRate))
            /* @ts-ignore */
            newTransaction.successedAt = new Date().toISOString()
            /* @ts-ignore */
            newTransaction.status = 'success'
          }
        }

        // console.log('NEW TRANSACTION AFTER:', newTransaction)


        const result = await this.transactionsService.create(newTransaction)
        /* @ts-ignore */
        if (result?.status === 400) await this.transactionsService.update(newTransaction.txid, newTransaction)
      }
    }

    return transactionsCount
  }

  async transactionsConfirmations() {
    const unconfirmedTransactions = await this.transactionsService.findUnconfirmedTransactions()

    for (let transaction of unconfirmedTransactions) {

      // console.log('transaction status: ', transaction.status)

      const { txid, receiver, amount, confirmations } = transaction

      const currentTransactionNew = await this.transactionsService.getTransactionByTxid(txid)

      /* @ts-ignore */
      const currentTransaction = JSON.parse(currentTransactionNew)

      const exchangeRate = await this.getLitecoinToUSD()

      // console.log('CURRENT TRANSACTION: ', currentTransaction)
      /* @ts-ignore */
      if (transaction.status === 'pending') {
        /* @ts-ignore */
        // console.log('confirmations: ', currentTransaction.confirmations)

        /* @ts-ignore */
        if (currentTransaction.confirmations > 0) {
          // console.log('after status')
          await this.usersService.updateBalance(receiver, (amount * exchangeRate))
          /* @ts-ignore */
          // console.log('CONFIRMED: ', currentTransaction.confirmations)
          const updatedTransaction = {
            ...transaction,
            /* @ts-ignore */
            confirmations: currentTransaction.confirmations,
            status: 'success',
            successedAt: new Date().toISOString(),
            exchangeRate: exchangeRate,
          }

          // console.log('CONFIRMED TRANSACTION:', updatedTransaction)
          return await this.transactionsService.update(txid, updatedTransaction)
        }
      }
    }
  }

  async amountToSafeSender() {
    const balanceString = await this.transactionsService.getBalance()
    // console.log(balanceString)
    const balance = +balanceString
    if (balance) { await this.transactionsService.sendAmountToSafe(+balance) } else { 
      // console.log('nothing to send') 
    }
  }

  async getLitecoinToUSD(): Promise<number> {
    try {
      const response = await axios.get('https://api.coingate.com/v2/rates/trader/sell/LTC/USD');

      // console.log(response)
      if (response.status === 200) {
        const rate = response.data
        // console.log(`Курс продажи Litecoin к USD: ${rate}`);
        return rate
      } else {
        // console.error('Не удалось получить курс продажи Litecoin к USD.');
      }
    } catch (error) {
      // console.error('Произошла ошибка при запросе к API CoinGate:', error);
    }
  }

}