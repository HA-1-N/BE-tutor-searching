import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { FindScheduleDto } from './dto/find-schedule-dto';
import { AcceptSchedule } from './dto/accept-schedule.dto';
import { MyScheduleDto } from './dto/my-schedule';
import { MyRegisterDto } from './dto/my-register';
import { RemoveScheduleDto } from './dto/remove-schedule';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('/create')
  create(@Body() createScheduleDto: CreateScheduleDto, @Req() req) {
    return this.schedulesService.create(createScheduleDto, req?.user?._id);
  }

  @Post('/find')
  find(@Body() findScheduleDto: FindScheduleDto) {
    return this.schedulesService.find(findScheduleDto);
  }

  @Post('/my-schedule')
  mySchedule(@Body() myScheduleDto: MyScheduleDto, @Req() req) {
    return this.schedulesService.mySchedule(myScheduleDto, req?.user?._id);
  }

  @Get('/my-schedule-today')
  myScheduleToday(@Req() req) {
    return this.schedulesService.myScheduleToday(req?.user?._id);
  }

  @Post('/my-register')
  myRegister(@Body() myRegisterDto: MyRegisterDto, @Req() req) {
    return this.schedulesService.myRegister(myRegisterDto, req?.user?._id);
  }

  @Post('/accept')
  accept(@Body() acceptSchedule: AcceptSchedule, @Req() req) {
    return this.schedulesService.accept(acceptSchedule, req?.user?._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Get('/')
  index() {
    return this.schedulesService.index();
  }

  @Post('remove-schedule')
  remove(@Body() removeScheduleDto: RemoveScheduleDto) {
    return this.schedulesService.remove(removeScheduleDto);
  }
}
