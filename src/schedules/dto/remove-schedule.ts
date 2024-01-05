import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveScheduleDto {
  @IsNotEmpty()
  @IsString()
  schedule_id: string;
}
