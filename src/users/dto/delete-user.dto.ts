import { IsArray } from 'class-validator';

export class DeleteUserDto {
  @IsArray()
  list_id: string[];
}
