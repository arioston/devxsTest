import { ApiProperty } from '@nestjs/swagger';

export class Token {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqb2VAZG9lLmNvbSIsIm5hbWUiOiJKb2UiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2MzYxOTg1MjcsImV4cCI6MTYzNjIxMzEyN30.oAwyKdDcJy2FG-QOIsMwbtQzLWPUr9b3UCiseMI0xOY',
    description: 'This is a JWT Hash',
  })
  accessToken: string;
}
