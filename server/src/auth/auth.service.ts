import { User } from '.prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UserNotFoundException,
  UserNotVerifiedException,
} from 'src/exceptions';
import { UsersService } from 'src/users/users.service';
import { LoggedUser, LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    return await this.userService.findByEmailAndPassword(email, password);
  }

  async validateUserByEmail(email: string) {
    return await this.userService.findByEmail(email);
  }

  async login(userLogin: LoginUserDto) {
    const user = await this.validateUser(userLogin.email, userLogin.password);

    if (!user) {
      throw new UserNotFoundException('Invalid login/password');
    }

    if (!user.verified) {
      throw new UserNotVerifiedException('User not verified');
    }

    return this.sign(user);
  }

  sign(user: Omit<User, 'password'>) {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async decode(auth: string) {
    if (auth) {
      const jwt = auth.replace('Bearer ', '');
      const tokenDecoded = this.jwtService.decode(jwt, {
        json: true,
      }) as LoggedUser;
      const loggedUser = new LoggedUser();
      return Object.assign(loggedUser, {
        email: tokenDecoded.email,
        name: tokenDecoded.name,
        id: tokenDecoded.id,
      });
    }
    return null;
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }
}
