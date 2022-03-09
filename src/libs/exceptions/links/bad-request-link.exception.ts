import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestLinkException extends HttpException {
  constructor() {
    super(
      {
        message: '연결할 수 없는 리소스 입니다.',
        errorCode: -2001,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
