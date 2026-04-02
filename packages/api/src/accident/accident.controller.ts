import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AccidentService } from './accident.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('accidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accidents')
export class AccidentController {
  constructor(private readonly accidentService: AccidentService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.accidentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accidentService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.accidentService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.accidentService.update(id, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @Body('processing_status_id') processing_status_id?: number,
  ) {
    return this.accidentService.updateStatus(id, status, processing_status_id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.accidentService.delete(id);
  }
}
