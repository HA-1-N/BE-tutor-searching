import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsNumber()
  @IsNotEmpty()
  role: number;
  @IsOptional()
  @IsString()
  phone: string;
  @IsOptional()
  @IsNumber()
  money: number;
  @IsOptional()
  @IsNumber()
  gender: number;
  @IsOptional()
  @IsString()
  date_of_birth: string;
}
