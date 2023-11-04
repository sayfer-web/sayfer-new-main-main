import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { WalletService } from 'src/wallet/wallet.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { Request } from "express"
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { Interval } from '@nestjs/schedule';
// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletService: WalletService,
  ) { }


  @Post('register')
  async create(@Body('username') username: string, @Body('password') password: string) {

    // const createdWallet = await this.walletService.createWallet(username)
    return await this.usersService.createNewUser(username, password);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }


  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Post('/editRoles')
  async editRoles(
    @Req() req: Request,
  ) {
    const { username, role } = req.body
    return this.usersService.editRoles(username, role)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/refreshBalance')
  async refreshBalance() {
    return this.usersService.refreshBalance()
  }

}
