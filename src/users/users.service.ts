import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import * as argon2 from 'argon2'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WalletService } from 'src/wallet/wallet.service';

// This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly walletService: WalletService,
    // private readonly filesService: FilesService
  ) { }

  // private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //   },
  // ];

  async findOne(username: string): Promise<User | undefined> {
    const userExist = await this.usersRepository.findOne({ where: { username } })
    if (!userExist) throw new BadRequestException('Unknown username or password')
    return userExist
  }

  async setCurrentRefreshToken(refreshToken: string, username: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    let currentUser = await this.usersRepository.findOneBy({ username })
    currentUser.currentHashedRefreshToken = currentHashedRefreshToken
    await this.usersRepository.save(currentUser);
  }

  async getById(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(username: string) {
    let user = await this.usersRepository.findOne({ where: { username } });
    user.currentHashedRefreshToken = null
    return this.usersRepository.save(user);
  }

  async createNewUser(createUserDto: CreateUserDto) {
    // validation
    // const { username, password, role } = createUserDto
    const createdWallet = await this.walletService.createLtcAddress(createUserDto.username)

    const isUserExist = await this.usersRepository.findOneBy({ username: createUserDto.username })
    if (isUserExist) throw new BadRequestException('Username exists')
    // if (isUserExist.phoneNumber === phoneNumber) 

    if (!createUserDto.phoneNumber) throw new BadRequestException('Wrong Number')
    const isPhoneExist = await this.usersRepository.findOneBy({ phoneNumber: createUserDto.phoneNumber })
    if (isPhoneExist) throw new BadRequestException('Phone number exists')

    const currentHashedPassword = await argon2.hash(createUserDto.password)

    // 

    const referrals = {
      'user1': {
        'user2': {
          'user3': {
            'user4': {

            }
          }
        },
        'user9': {
          'user8': {

          },
          'user12': {

          }
        },
        'user10': {

        },
      }
    }

    // console.log(JSON.stringify(referrals))

    // 

    let referrer = null

    if (createUserDto.referrer) {
      // console.log(createUserDto.referrer)
      const referrerUser = await this.usersRepository.findOneBy({ username: createUserDto.referrer })
      // console.log(referrerUser)
      if (referrerUser) {
        // referrer
        referrer = referrerUser.username
        // referral
        if (referrerUser.referrals) {
          referrerUser.referrals.push(createUserDto.username)
        } else {
          referrerUser.referrals = [createUserDto.username]
        }
        await this.usersRepository.save(referrerUser)
      } else {
        throw new BadRequestException('Referral username does not exist')
      }
    }


    const newUser = {
      // id: 1,
      username: createUserDto.username,
      password: currentHashedPassword,
      phoneNumber: createUserDto.phoneNumber,
      role: '1',
      currentHashedRefreshToken: null,
      referrer,
    }

    // console.log("AFTER: ", referrer, newUser)


    return this.usersRepository.save(newUser)
    //{ username: user.username, password: user.password, role: user.role }
  }

  async findAll() {
    const usersList: User[] = await this.usersRepository.find()
    return usersList
  }

  // async findReferralsByUsername(username: string): Promise<User> {
  //   const users: User = await this.usersRepository.findOneBy({ username })
  //   return usersList
  // }

  async update(username: string, updateUserDto: UpdateUserDto) {

    const user = await this.usersRepository.findOneBy({ username })
    if (!user) throw new BadRequestException('User doesnt exist')

    return await this.usersRepository.update(user.id, { ...updateUserDto })

  }

  async updateBalance(username: string, amount: number) {
    const user = await this.usersRepository.findOneBy({ username })
    if (!user) return new BadRequestException('user doesnt exist')
    // console.log('CHECK: ', user.tokenBalanceSFR, amount)
    const newBalance = user.tokenBalanceSFR + amount
    return await this.usersRepository.update(user.id, { tokenBalanceSFR: newBalance })
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }


  async refreshBalance() {

    // cron: check user wallet current balance

    // cron: check pending tokens

    // cron: if money > 0 send then 

    // cron: check 

    return 0
  }

  async updatePassword(username: string, newPwd: string) {
    const user = await this.usersRepository.findOne({ where: { username } })
    if (!user) throw new NotFoundException('User not found')
    const currentHashedPassword = await argon2.hash(newPwd)
    user.password = currentHashedPassword
    return await this.usersRepository.save(user)
  }

  async editRoles(username: string, role: string) {

    const user = await this.usersRepository.findOne({ where: { username } })
    if (!user) throw new NotFoundException('User not found')
    const updatedUser = { ...user, roles: [role] }
    return await this.usersRepository.save(updatedUser)
  }

  async editContract(username: string, status: string) {

    const user = await this.usersRepository.findOne({ where: { username } })
    if (!user) throw new NotFoundException('User not found')
    const updatedUser = { ...user, contractStatus: status }
    return await this.usersRepository.update(user.id, { contractStatus: status })
  }


}