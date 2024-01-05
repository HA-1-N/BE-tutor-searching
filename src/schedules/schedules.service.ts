import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from 'src/schemas/schedules.schema';
import { UsersService } from 'src/users/users.service';
import { FindScheduleDto } from './dto/find-schedule-dto';
import { MyScheduleDto } from './dto/my-schedule';
import { MyRegisterDto } from './dto/my-register';
import { RemoveScheduleDto } from './dto/remove-schedule';
import { AcceptSchedule } from './dto/accept-schedule.dto';
import { MyScheduleTodayDto } from './dto/my-schedule-today';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModal: Model<Schedule>,
    private userService: UsersService,
  ) {}
  async index() {
    try {
      return await this.scheduleModal
        .find()
        .populate('subject_id')
        .populate('student_id')
        .populate('tutor_id');
    } catch (error) {
      throw error;
    }
  }

  async create(createScheduleDto: CreateScheduleDto, userId: string) {
    try {
      const existUser = await this.userService.findOne(userId);

      if (!existUser)
        throw new BadRequestException({ message: 'Không tìm tháy user_id' });

      if (existUser?.is_block)
        throw new BadRequestException({
          message:
            'Tài khoản của bạn đã bị khóa, vui lòng liên hệ với admin để mở khóa',
        });

      if (existUser.money < createScheduleDto.price * 3)
        throw new BadRequestException({
          message: 'Số tiền trong tài khoản của bạn chưa đủ để đăng kí lớp',
        });

      const timeArray = this.convertToTimeArray(
        createScheduleDto.day,
        createScheduleDto.hour,
      );

      let existClass = {} as any;

      if (existUser.role === 2) {
        existClass = await this.scheduleModal
          .findOne({
            tutor_id: userId,
            time: { $in: timeArray },
          })
          .populate('subject_id');
      } else if (existUser.role === 1) {
        existClass = await this.scheduleModal
          .findOne({
            student_id: userId,
            time: { $in: timeArray },
          })
          .populate('subject_id');
      }

      if (existClass)
        throw new BadRequestException({
          message: existClass?.is_accepted
            ? 'Bạn đã có lớp học trùng khung giờ này'
            : 'Bạn đang đăng tạo một lớp trùng với khung giờ này ',
          data: existClass,
        });

      const data = await this.scheduleModal.create({
        ...createScheduleDto,
        ...(existUser.role === 1 && { student_id: userId }),
        ...(existUser.role === 2 && { tutor_id: userId }),
        type: existUser.role,
        time: timeArray,
      });

      await this.userService.cashMoney(
        {
          money: Number(createScheduleDto.price) * -3,
        },
        userId,
      );

      return {
        status: HttpStatus.OK,
        message: 'Đăng kí lớp thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async find(findScheduleDto: FindScheduleDto) {
    try {
      let condition = {};
      if (findScheduleDto.subject_id) {
        condition = { ...condition, subject_id: findScheduleDto.subject_id };
      }

      if (findScheduleDto.price) {
        condition = { ...condition, price: { $lte: findScheduleDto.price } };
      }

      if (findScheduleDto.num_sessions) {
        condition = {
          ...condition,
          num_sessions: { $lte: findScheduleDto.num_sessions },
        };
      }

      if (findScheduleDto.hour) {
        condition = { ...condition, hour: { $in: findScheduleDto.hour } };
      }

      if (findScheduleDto.day) {
        condition = { ...condition, day: { $in: findScheduleDto.day } };
      }

      const data = await this.scheduleModal
        .find({
          is_accepted: false,
          ...(findScheduleDto.type === 2 && { student_id: { $exists: false } }),
          ...(findScheduleDto.type === 1 && { tutor_id: { $exists: false } }),
          ...condition,
        })
        .populate({ path: 'tutor_id', select: '-password' })
        .populate({ path: 'student_id', select: '-password' })
        .populate('subject_id');

      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async accept(acceptSchedule: AcceptSchedule, userId: string) {
    try {
      const existUser = await this.userService.findOne(userId);

      const existSchedule = await this.findOne(acceptSchedule.schedule_id);

      if (!existUser)
        throw new BadRequestException({
          message: 'Không tìm thấy user_id',
        });

      if (!existSchedule)
        throw new BadRequestException({
          message: 'Không tìm thấy schedule_id',
        });

      if (existUser?.is_block)
        throw new BadRequestException({
          message:
            'Tài khoản của bạn đã bị khóa, vui lòng liên hệ với admin để mở khóa',
        });

      if (existUser.money < existSchedule.price * 3)
        throw new BadRequestException({
          message: 'Số tiền trong tài khoản của bạn chưa đủ để đăng kí lớp',
        });

      let existClass = {} as any;

      if (existUser.role === 1) {
        existClass = await this.scheduleModal
          .findOne({
            student_id: userId,
            time: { $in: existSchedule.time },
          })
          .populate('subject_id');
      } else if (existUser.role === 2) {
        existClass = await this.scheduleModal
          .findOne({
            tutor_id: userId,
            time: { $in: existSchedule.time },
          })
          .populate('subject_id');
      }

      if (existClass)
        throw new BadRequestException({
          message: existClass?.is_accepted
            ? 'Bạn đã có lớp học trùng khung giờ này'
            : 'Bạn đang đăng tạo một lớp trùng với khung giờ này ',
          data: existClass,
        });

      const data = await this.scheduleModal.findByIdAndUpdate(
        acceptSchedule.schedule_id,
        {
          ...(existUser.role === 2 && {
            tutor_id: userId,
          }),
          ...(existUser.role === 1 && {
            student_id: userId,
          }),
          is_accepted: true,
        },
        { new: true },
      );

      await this.userService.cashMoney(
        {
          money: Number(existSchedule.price) * -3,
        },
        userId,
      );

      return {
        status: HttpStatus.OK,
        message: 'Bạn đã accept lớp này thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(_id: string) {
    try {
      return await this.scheduleModal.findOne({ _id });
    } catch (error) {
      throw error;
    }
  }

  async mySchedule(myScheduleDto: MyScheduleDto, userId: string) {
    try {
      let condition = {};
      if (myScheduleDto.subject_id) {
        condition = { ...condition, subject_id: myScheduleDto.subject_id };
      }

      if (myScheduleDto.price) {
        condition = { ...condition, price: { $lte: myScheduleDto.price } };
      }

      if (myScheduleDto.num_sessions) {
        condition = {
          ...condition,
          num_sessions: { $lte: myScheduleDto.num_sessions },
        };
      }

      if (myScheduleDto.hour) {
        condition = { ...condition, hour: { $in: myScheduleDto.hour } };
      }

      if (myScheduleDto.day) {
        condition = { ...condition, day: { $in: myScheduleDto.day } };
      }
      const user = await this.userService.findOne(userId);
      if (!user)
        throw new BadRequestException({
          message: 'Không tồn tại người dùng',
        });
      let data;
      if (user.role === 1) {
        data = await this.scheduleModal
          .find({
            ...condition,
            student_id: user._id,
            is_accepted: true,
          })
          .populate('subject_id')
          .populate('student_id')
          .populate('tutor_id');
      } else {
        data = await this.scheduleModal
          .find({
            ...condition,
            tutor_id: user._id,
            is_accepted: true,
          })
          .populate('subject_id')
          .populate('student_id')
          .populate('tutor_id');
      }

      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async myScheduleToday(userId: string) {
    try {
      const currentDate = new Date();
      let currentDay = currentDate.getDay();
      currentDay = currentDay + 1;
      if (currentDay == 1) currentDay = currentDay + 7;

      const user = await this.userService.findOne(userId);
      if (!user)
        throw new BadRequestException({
          message: 'Không tồn tại người dùng',
        });
      let data;
      if (user.role === 1) {
        data = await this.scheduleModal
          .find({
            student_id: user._id,
            is_accepted: true,
            day: { $in: Number(currentDay) },
          })
          .populate('subject_id')
          .populate('student_id');
      } else {
        data = await this.scheduleModal
          .find({
            tutor_id: user._id,
            is_accepted: true,
            day: { $in: Number(currentDay) },
          })
          .populate('subject_id')
          .populate('tutor_id');
      }
      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async myRegister(myRegisterDto: MyRegisterDto, userId: string) {
    try {
      let condition = {};
      if (myRegisterDto.subject_id) {
        condition = { ...condition, subject_id: myRegisterDto.subject_id };
      }

      if (myRegisterDto.price) {
        condition = { ...condition, price: { $lte: myRegisterDto.price } };
      }

      if (myRegisterDto.num_sessions) {
        condition = {
          ...condition,
          num_sessions: { $lte: myRegisterDto.num_sessions },
        };
      }

      if (myRegisterDto.hour) {
        condition = { ...condition, hour: { $in: myRegisterDto.hour } };
      }

      if (myRegisterDto.day) {
        condition = { ...condition, day: { $in: myRegisterDto.day } };
      }
      const user = await this.userService.findOne(userId);
      if (!user)
        throw new BadRequestException({
          message: 'Không tồn tại người dùng',
        });
      let data;
      if (user.role === 1) {
        data = await this.scheduleModal
          .find({
            ...condition,
            student_id: user._id,
            is_accepted: false,
          })
          .populate('subject_id')
          .populate('student_id');
      } else {
        data = await this.scheduleModal
          .find({
            ...condition,
            tutor_id: user._id,
            is_accepted: false,
          })
          .populate('subject_id')
          .populate('tutor_id');
      }

      return {
        status: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(removeScheduleDto: RemoveScheduleDto) {
    try {
      const schedule = await this.findOne(removeScheduleDto.schedule_id);
      if (!schedule)
        throw new BadRequestException({ message: 'Không có lịch trên' });
      if (schedule.type === 1) {
        await this.userService.cashMoney(
          {
            money: Number(schedule.price) * 3,
          },
          schedule.student_id,
        );
      } else {
        await this.userService.cashMoney(
          {
            money: Number(schedule.price) * 3,
          },
          schedule.tutor_id,
        );
      }
      await this.scheduleModal.findByIdAndRemove(removeScheduleDto.schedule_id);
      return {
        status: HttpStatus.ACCEPTED,
        message: 'Đã xóa thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  convertToTimeArray(day: string[], hour: string[]) {
    const time = [];

    for (let i = 0; i < day.length; i++) {
      time.push(day[i] + '-' + hour[i]);
    }

    return time;
  }
}
