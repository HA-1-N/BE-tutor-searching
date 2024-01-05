import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.schema';
import { Schedule, ScheduleSchema } from 'src/schemas/schedules.schema';

import { SchedulesService } from 'src/schedules/schedules.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, SchedulesService],
})
export class UsersModule {}
