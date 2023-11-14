import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, HttpCode, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { Request } from 'express'
import { Cookies } from 'src/decorators/cookies.decorator';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(
    @Req() request: Request,
    // @Cookies() cookies: any,
  ) {
    const { username } = request.body

    const user = await this.usersService.findOne(username)
    
    if(!user) throw new UnauthorizedException();

    const { accessTokenCookie, accessToken } = this.authService.getCookieWithJwtAccessToken(user);

    const {
      cookie: refreshTokenCookie,
      token: refreshToken
    } = this.authService.getCookieWithJwtRefreshToken(username);

    await this.usersService.setCurrentRefreshToken(refreshToken, username);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);


    return { token: accessToken, ...user }
  }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: Request) {
    return '1';
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: any) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: any) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
