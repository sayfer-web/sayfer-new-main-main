import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2'
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException('User doesnt exist')
    const verifiedPass = await argon2.verify(user.password, pass)
    if (verifiedPass) {
      const { password: pwd, ...result } = user;
      return result;
    }
    return null;
  }

  async updatePassword(username: string, oldPass: string, newPass: string): Promise<any> {

    // console.log('user.password:', username);
    // console.log('oldPass:', oldPass);

    // const user = await this.usersService.findOne(username)
    // if (!user) return new BadRequestException('User doesnt exist')

    const verifiedPass = await this.validateUser(username, oldPass)
    if (!verifiedPass) throw new BadRequestException('Wrong password')

    // const currentHashedPassword = await argon2.hash(newPass)
    // if(!currentHashedPassword) return new BadRequestException('Something went wrong!')

    throw await this.usersService.updatePassword(username, newPass)

  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public getCookieWithJwtAccessToken(user: User) {
    const payload = { username: user.username, roles: user.roles };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS'),
      expiresIn: `${this.configService.get('JWT_ACCESS_EXP_TIME')}s`
    });

    const accessTokenCookie = `Authentication=${token}; SameSite=Strict; Secure; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_EXP_TIME')}`
    return {
      accessToken: token,
      accessTokenCookie
    };
  }

  public getCookieWithJwtRefreshToken(username: string) {
    const payload = { username };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXP_TIME')}s`
    });
    const cookie = `Refresh=${token}; SameSite=Strict; Secure; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_EXP_TIME')}`;
    return {
      cookie,
      token
    }
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; SameSite=Strict; Secure; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; SameSite=Strict; Secure; HttpOnly; Path=/; Max-Age=0'
    ];
  }
}