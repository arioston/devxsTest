import { ApiProperty, PartialType } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'Joe', description: 'The name of the user' })
  public email?: string;
  @ApiProperty({ example: '******', description: 'The email of the user' })
  public password: string;
}

export class LoggedUser {
  id: number;
  email: string;
  name?: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'Joe', description: 'The name of the user' })
  name?: string;
  @ApiProperty({ example: 'joe@doe.com', description: 'The email of the user' })
  email: string;
  @ApiProperty({ example: '****', description: 'The password of the user' })
  password: string;
  @ApiProperty({ example: 'ADMIN', description: 'The role of the user' })
  role: string;
}

export class EmailSendDto {
  @ApiProperty({ example: 'joe@doe.com', description: 'The email of the user' })
  email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
