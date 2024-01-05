import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindUserByEmailAndUsernameDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsEmail()
  username: string;
}
