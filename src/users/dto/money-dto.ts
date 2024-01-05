import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MoneyDto {
  @IsString()
  @IsOptional()
  _id?: string;
  @IsNumber()
  money: number;
}
