import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  public constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotVerifiedException extends HttpException {
  public constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
