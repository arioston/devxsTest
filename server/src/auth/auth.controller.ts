import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  EmailSendDto,
  LoginUserDto,
} from './dto/login-user.dto';
import { Token } from './dto/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: Token })
  async login(@Body() user: LoginUserDto): Promise<Token> {
    const accessToken = await this.authService.login(user);
    return new Token(accessToken);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('checked/:key')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: Token })
  async emailChecked(@Param('key') key: string) {
    const user = await this.usersService.validateUserEmail(key);
    const accessToken = this.authService.sign(user);
    return new Token(accessToken);
  }

  @Post('send-email')
  async sendVerificationEmail(@Body() emailSendDto: EmailSendDto) {
    return this.usersService.sendVerificationEmail(emailSendDto.email);
  }
}
