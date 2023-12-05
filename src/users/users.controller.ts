import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
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
  ) { }


  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    // if(!createdWallet) return new BadRequestException('Something went wrong!')
    return await this.usersService.createNewUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('referrals/:username')
  findReferralsByUsername(@Param('username') username: string) {
    return this.usersService.findAll();
  }


  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateProfile')
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    /* @ts-ignore */
    const { username } = req.user

    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }


  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.User)
  // @Post('/updatePassword')
  // async editPassword(@Body('oldPwd') oldPwd: string, @Body('newPwd') newPwd: string, @Req() req: Request) {
  //   const { username, role } = req.body
  //   return this.usersService.updatePassword(oldPwd, newPwd, username)
  // }

  @UseGuards(JwtAuthGuard)
  // @Roles(Role.User)
  @Post('/editRoles')
  async editRoles(
    @Req() req: Request,
  ) {
    const { username, role } = req.body
    return this.usersService.editRoles(username, role)
  }

  @UseGuards(JwtAuthGuard)
  // @Roles(Role.User)
  @Post('/editContract/:status/:username')
  async editContract(
    // @Req() req: Request,
    @Param('status') status: string,
    @Param('username') username: string,
  ) {
    // const { username } = req.body
    // console.log('CONTRACT USERNAME:', username)
    return this.usersService.editContract(username, status)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/refreshBalance')
  async refreshBalance() {
    return this.usersService.refreshBalance()
  }

}
