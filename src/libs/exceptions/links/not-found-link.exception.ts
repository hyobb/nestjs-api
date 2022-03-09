import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundLinkException extends HttpException {
  constructor() {
    super(
      {
        message: '연결할 링크 리소스를 찾을 수 없습니다.',
        errorCode: -2000,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
