import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.schema';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { Schedule, ScheduleSchema } from 'src/schemas/schedules.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, SchedulesModule, JwtService],
})
export class AuthModule {}
