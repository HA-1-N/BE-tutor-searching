import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  subject_id: string;

  @ArrayNotEmpty()
  day: string[];

  @ArrayNotEmpty()
  hour: string[];

  @IsNotEmpty()
  @IsNumber()
  num_sessions: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
