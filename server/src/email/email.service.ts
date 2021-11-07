import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UniqueKey, User } from '@prisma/client';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  sendVerificationEmail(user: User, uniqueKey: UniqueKey) {
    this.logger.log(
      `Send Email to userId[${user.id}] with unique key[${uniqueKey.id}]`,
    );
    try {
      this.mailerService
        .sendMail({
          to: user.email,
          subject: this.config.get<string>('EMAIL_VERIFY_SUBJECT'),
          template: './email_verification',
          context: {
            host: this.config.get<string>('URL_EMAIL_VERIFY'),
            uniqueKey: uniqueKey.id,
          },
        })
        .then((result) => this.logger.debug(result))
        .catch((err) => this.logger.error(err))
        .finally(() =>
          this.logger.log(
            `Sent Email to userId[${user.id}] with unique key[${uniqueKey.id}]`,
          ),
        );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
