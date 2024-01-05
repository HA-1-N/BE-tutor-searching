import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MoneyDto } from './dto/money-dto';
import { PasswordDto } from './dto/password-dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/')
  findAll(@Req() req) {
    return this.usersService.findAll(req?.user?.role);
  }

  @Get('/statis')
  statis(@Req() req) {
    return this.usersService.statis(req?.user?.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('/cash')
  cashMoney(@Body() moneyDto: MoneyDto, @Req() req) {
    return this.usersService.cashMoney(moneyDto, req?.user?._id);
  }

  @Patch('/cash-by-admin')
  cashMoneyByAdmin(@Body() moneyDto: MoneyDto, @Req() req) {
    return this.usersService.cashMoneyByAdmin(moneyDto, req?.user?.role);
  }

  @Patch('/change-password')
  changePassword(@Body() passwordDto: PasswordDto, @Req() req) {
    return this.usersService.changePassword(passwordDto, req?.user?._id);
  }

  @Patch('/change-info')
  changeInfo(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.changeInfo(updateUserDto, req?.user?._id);
  }

  @Patch('/change-info-by-admin')
  changeInfoByAdmin(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.changeInfoByAdmin(updateUserDto, req?.user?.role);
  }

  @Patch('/block/:id')
  block(@Param('id') id: string, @Req() req) {
    return this.usersService.block(id, req?.user?.role);
  }

  @Post('/delete-user')
  remove(@Body() deleteUserDto: DeleteUserDto, @Req() req) {
    return this.usersService.remove(deleteUserDto, req?.user?.role);
  }
}
