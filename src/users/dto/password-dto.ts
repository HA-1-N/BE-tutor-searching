import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordDto {
  @IsString()
  @IsNotEmpty()
  old_password: string;
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
