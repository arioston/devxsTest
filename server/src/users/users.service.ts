import {
  Injectable,
  Logger,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { UniqueKey } from '@prisma/client';
import { CryptographyService } from 'src/cryptography/cryptography.service';
import { EmailService } from 'src/email/email.service';
import { UserNotFoundException } from 'src/exceptions';
import { EXPIRATION_DELTA_KEY } from 'src/parameter/constants';
import { ParameterService } from 'src/parameter/parameter.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UniqueKeyService } from 'src/unique-key/unique-key.service';

import { Prisma, User } from '.prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptographyService: CryptographyService,
    private readonly parameterService: ParameterService,
    private readonly uniqueKeyService: UniqueKeyService,
    private readonly emailService: EmailService,
  ) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const userOrNull = await this.findByEmail(data.email);

    if (userOrNull) {
      throw new PreconditionFailedException('Email already exist');
    }

    const user = await this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: this.cryptographyService.encrypt(data.password),
        role: data.role || 'GUEST',
        uniqueKeys: { create: {} },
      },
      include: {
        uniqueKeys: true,
      },
    });

    this.emailService.sendVerificationEmail(
      user,
      (await this.uniqueKeyActive(user.id)).uniqueKeys[0],
    );

    return user;
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findVerifiedBy(email: string, password: string) {
    return await this.prismaService.user.findFirst({
      where: { email, password, verified: true },
    });
  }

  async findByEmailAndPassword(email: string, password: string) {
    const encryptPassword = this.cryptographyService.encrypt(password);

    const user = await this.prismaService.user.findFirst({
      where: { email, password: encryptPassword },
      select: {
        email: true,
        name: true,
        role: true,
        id: true,
        verified: true,
      },
    });

    if (user) {
      return user;
    }

    throw new UserNotFoundException('User/Password not found!');
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: updateUserDto.role,
      },
    });
  }

  async updateWithUniqueKey(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        verified: updateUserDto.verified,
        uniqueKeys: updateUserDto.uniqueKeys,
      },
    });
  }

  async remove(id: number) {
    const unique = await this.prismaService.uniqueKey.findFirst({
      where: { userId: id },
    });
    await this.prismaService.uniqueKey.delete({
      where: { id: unique.id },
    });
    await this.prismaService.product.deleteMany({
      where: { userId: id },
    });
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  async uniqueKeyActive(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        uniqueKeys: {
          where: {
            validatedAt: null,
          },
        },
      },
    });
  }

  async validateUserEmail(uniqueKeyId: string) {
    const uniqueKey = await this.uniqueKeyService.findOne(uniqueKeyId);

    if (!uniqueKey) {
      throw new UnauthorizedException('Key not found');
    }

    const { value: deltaTime } = await this.parameterService.findOne(
      EXPIRATION_DELTA_KEY,
    );
    const isExpired = this.uniqueKeyService.isUniqueKeyExired(
      uniqueKey,
      +deltaTime,
    );

    if (isExpired) {
      throw new UnauthorizedException('Expired token');
    }

    return await this.updateWithUniqueKey(uniqueKey.userId, {
      verified: true,
      uniqueKeys: {
        update: {
          where: { id: uniqueKey.id },
          data: { validatedAt: new Date() },
        },
      },
    });
  }

  async sendVerificationEmail(
    userOrEmail: User | string,
    uniqueKey?: UniqueKey,
  ): Promise<void> {
    const user =
      typeof userOrEmail == 'string'
        ? await this.findByEmail(userOrEmail)
        : userOrEmail;

    const _uniqueKey =
      uniqueKey || (await this.uniqueKeyActive(user.id)).uniqueKeys[0];

    if (!user || !_uniqueKey) {
      throw new UnauthorizedException('Email not found');
    }

    this.emailService.sendVerificationEmail(user, _uniqueKey);
  }
}
