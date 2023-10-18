import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ERROR_MESSAGES } from 'src/constants';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: ERROR_MESSAGES.NOT_EMPTY })
  readonly name: string;

  @ApiProperty()
  @IsPhoneNumber('RU', { message: ERROR_MESSAGES.INVALID_PHONE_FORMAT })
  readonly phone: string;
}
