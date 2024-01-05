import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  _id: string;
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  phone: string;
  @IsNumber()
  @IsOptional()
  gender: number;
  @IsString()
  @IsOptional()
  date_of_birth: string;
}
