import {
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsUppercase,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AbstractUserDto } from './abstract_user.dto';

export class CreateUserDto extends AbstractUserDto {}
