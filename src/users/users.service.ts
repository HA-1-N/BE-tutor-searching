import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { FindUserByEmailAndUsernameDto } from './dto/find-user-by-email-and-username.dto';
import { MoneyDto } from './dto/money-dto';
import { PasswordDto } from './dto/password-dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Schedule } from 'src/schemas/schedules.schema';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nest-modules/mailer';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    @InjectModel(Schedule.name) private scheduleModal: Model<Schedule>,
    private mailerService: MailerService,
  ) {}

  async statis(role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được danh sách người dùng',
      });
    }
    try {
      const count_student = await this.userModal
        .find({ role: 1 })
        .countDocuments();
      const count_tutor = await this.userModal
        .find({ role: 2 })
        .countDocuments();
      const count_schedule = await this.scheduleModal.find({}).countDocuments();
      return { count_student, count_tutor, count_schedule };
    } catch (error) {
      throw error;
    }
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const userCreated = await this.userModal.create({ ...createUserDto });
      const { password, ...data } = userCreated.toObject();
      return {
        status: HttpStatus.CREATED,
        message: 'Thêm mới user thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndUsername(
    findUserByEmailAndUsernameDto: FindUserByEmailAndUsernameDto,
  ) {
    try {
      const user = await this.userModal.find({
        $or: [
          { email: findUserByEmailAndUsernameDto.email },
          { username: findUserByEmailAndUsernameDto.username },
        ],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userModal.findOne({ username });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAll(role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được danh sách người dùng',
      });
    }
    try {
      return await this.userModal
        .find({ role: { $ne: 3 } })
        .select('-password')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.userModal.findById(id);
    } catch (error) {}
  }

  async cashMoney(moneyDto: MoneyDto, userId: string) {
    try {
      const data = await this.userModal
        .findByIdAndUpdate(
          userId,
          { $inc: { money: moneyDto.money } },
          { new: true },
        )
        .select('-password');
      return {
        status: HttpStatus.CREATED,
        message: 'Nạp tiền thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async cashMoneyByAdmin(moneyDto: MoneyDto, role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Không có quyền',
      });
    }
    try {
      const data = await this.userModal
        .findByIdAndUpdate(
          moneyDto._id,
          { $inc: { money: moneyDto.money } },
          { new: true },
        )
        .select('-password');
      return {
        status: HttpStatus.CREATED,
        message: 'Nạp tiền thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(passwordDto: PasswordDto, userId: string) {
    try {
      const existedAccount = await this.findOne(userId);

      if (!existedAccount) {
        throw new BadRequestException({
          message: 'Tài khoản của bạn không tồn tại',
        });
      }

      if (
        !(await bcrypt.compare(
          passwordDto.old_password,
          existedAccount.password,
        ))
      ) {
        throw new BadRequestException({
          message: 'Mật khẩu cũ không chính xác',
        });
      }

      const password = await bcrypt.hash(passwordDto.new_password, 10);

      await this.userModal.findByIdAndUpdate(userId, {
        password,
      });

      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

      await this.mailerService.sendMail({
        from: 'hienvt0202@gmail.com',
        to: existedAccount?.email,
        subject: 'Thông báo thay đổi mật khẩu',
        html: `
      <h1>Xác nhận thay đổi mật khẩu tài khoản ${existedAccount.username}</h1>
      <p>Vào thời gian ${currentDate} tài khoản của bạn trên hệ thống đã bị thay đổi mật khẩu. Nếu đó không phải là bạn xin hãy liên hệ ngay với đội ngũ quản trị viên để được hỗ trợ</p>
      `,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Thay đổi mật khẩu thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async changeInfo(updateUserDto: UpdateUserDto, userId: string) {
    try {
      const data = await this.userModal.findByIdAndUpdate(
        userId,
        updateUserDto,
        {
          new: true,
        },
      );
      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật thông tin thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeInfoByAdmin(updateUserDto: UpdateUserDto, role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được cập nhật người dùng',
      });
    }
    try {
      const { _id, ...rest } = updateUserDto;
      const data = await this.userModal.findByIdAndUpdate(_id, rest, {
        new: true,
      });
      return {
        status: HttpStatus.CREATED,
        message: 'Cập nhật thông tin thành công',
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async block(id: string, role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được khóa người dùng',
      });
    }
    try {
      const user = await this.userModal.findById(id);
      user.is_block = !user.is_block;
      await user.save();
      return {
        status: HttpStatus.OK,
        message: 'Thay đổi trạng thái thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(deleteUserDto: DeleteUserDto, role: number) {
    if (role !== 3) {
      throw new BadRequestException({
        message: 'Chỉ admin mới xem được xóa người dùng',
      });
    }
    try {
      await this.userModal.deleteMany({ _id: { $in: deleteUserDto.list_id } });
      await this.scheduleModal.deleteMany({
        $or: [
          { tutor_id: { $in: deleteUserDto.list_id } },
          { student_id: { $in: deleteUserDto.list_id } },
        ],
      });
      return {
        status: HttpStatus.OK,
        message: 'Xóa người dùng thành công',
      };
    } catch (error) {
      throw error;
    }
  }
}
