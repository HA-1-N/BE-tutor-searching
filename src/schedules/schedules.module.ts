import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from 'src/schemas/schedules.schema';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService, UsersService],
})
export class SchedulesModule {}
