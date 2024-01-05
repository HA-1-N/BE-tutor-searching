import { IsNotEmpty, IsString } from 'class-validator';

export class MyScheduleTodayDto {
  @IsNotEmpty()
  @IsString()
  _id: string;
}
