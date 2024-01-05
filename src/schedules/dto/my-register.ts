import { ArrayNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MyRegisterDto {
  @IsOptional()
  @IsString()
  subject_id: string;

  @ArrayNotEmpty()
  @IsOptional()
  day: string[];

  @ArrayNotEmpty()
  @IsOptional()
  hour: string[];

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  num_sessions: number;
}
