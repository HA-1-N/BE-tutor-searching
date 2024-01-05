import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptSchedule {
  @IsNotEmpty()
  @IsString()
  schedule_id: string;
}
