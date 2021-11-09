import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { ParameterModule } from 'src/parameter/parameter.module';
import { UniqueKeyModule } from 'src/unique-key/unique-key.module';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UniqueKeyModule,
        ParameterModule,
        ConfigModule,
        MailerModule.forRoot({
          transport: {
            host: process.env.EMAIL_HOST,
            port: +process.env.EMAIL_PORT,
            secure: false, // upgrade later with STARTTLS
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          },
          defaults: {
            from: process.env.EMAIL_FROM,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        }),
      ],
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
