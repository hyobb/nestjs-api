import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidResourceTypeException extends HttpException {
  constructor() {
    super(
      {
        message: '올바르지 않은 리소스 타입 입니다.',
        errorCode: -1000,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
