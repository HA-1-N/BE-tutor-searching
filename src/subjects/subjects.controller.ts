import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto, @Req() req) {
    return this.subjectsService.create(createSubjectDto, req?.user?.role);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Patch('/soft-delete/:id')
  softDelete(@Param('id') id: string, @Req() req) {
    return this.subjectsService.softDelete(id, req?.user?.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Req() req,
  ) {
    return this.subjectsService.update(id, updateSubjectDto, req?.user?.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.subjectsService.remove(id, req?.user?.role);
  }
}
