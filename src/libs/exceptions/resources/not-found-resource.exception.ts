import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundResourceException extends HttpException {
  constructor() {
    super(
      {
        message: '리소스를 찾을 수 없습니다.',
        errorCode: -1001,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
