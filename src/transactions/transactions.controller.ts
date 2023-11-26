import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // Database Transactions
  

  @Get('findAllTransactions')
  findAllTransactions() {
    return this.transactionsService.findAll()
  }
  

  @Get('findTransactionById/:id')
  findTransactionById(@Param('id') id: string) {
    return this.transactionsService.findTransactionById(id)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.transactionsService.remove(id)
  }
  // Litecoin-CLI commands

  // @UseGuards(JwtAuthGuard)
  @Get('getAllTransactions')
  getAllTransaction() {
    return this.transactionsService.getAllTransactions()
  }
  
  // @UseGuards(JwtAuthGuard)
  @Get('getTransactionsAfter/:count')
  getLastTransactionsAfter(@Param('count') count: number) {
    return this.transactionsService.getLastTransactions(count)
  }

  @Get('getNewAddressBy/:username')
  getNewAddressByUsername(@Param('username') username: string) {
    return this.transactionsService.getNewAddressByUsername(username)
  }

  @Get('loadGlobalWallet')
  loadGlobalWallet() {
    return this.transactionsService.loadGlobalWallet()
  }

  @Get('getBalances')
  getBalances() {
    return this.transactionsService.getBalances()
  }

  @Post('send/:id')
  send(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.transactionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
  //   return this.transactionsService.update(+id, updateTransactionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionsService.remove(+id);
  // }
}
