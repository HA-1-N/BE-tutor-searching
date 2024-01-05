import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(registerDto: RegisterDto) {
    try {
      const existAccount = await this.userService.findByEmailAndUsername({
        email: registerDto.email,
        username: registerDto.username,
      });
      if (existAccount?.length > 0)
        throw new BadRequestException({
          message: 'Email hoặc Username đã tồn tại',
        });
      const password = await bcrypt.hash(registerDto.password, 10);
      return await this.userService.create({ ...registerDto, password });
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const existAccount = await this.userService.findByUsername(
        loginDto.username,
      );
      if (!existAccount)
        throw new BadRequestException({ message: 'Username không tồn tại' });

      // Check Password
      const isCorrectPassword = await bcrypt.compare(
        loginDto.password,
        existAccount.password,
      );
      if (!isCorrectPassword)
        throw new BadRequestException({ message: 'Mật khẩu chưa chính xác' });

      if (existAccount?.is_block)
        throw new BadRequestException({
          message:
            'Tài khoản của bạn đã bị khóa, vui lòng liên hệ với admin để mở khóa',
        });

      const { password, ...data } = existAccount.toObject();

      const accessToken = await this.jwtService.signAsync(data, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('EXPIRESIN_TOKEN'),
      });

      return {
        status: HttpStatus.OK,
        message: 'Đăng nhập thành công',
        data: { ...data, accessToken },
      };
    } catch (error) {
      throw error;
    }
  }
}
