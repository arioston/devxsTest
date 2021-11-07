import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class CryptographyService {
  encrypt(text: string) {
    return createHash('sha256').update(text).digest('base64');
  }

  compare(text: string, hashToCompare?: string) {
    return this.encrypt(text) == hashToCompare;
  }
}
