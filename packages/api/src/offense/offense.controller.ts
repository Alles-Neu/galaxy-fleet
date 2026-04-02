import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OffenseService } from './offense.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('offenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('offenses')
export class OffenseController {
  constructor(private readonly offenseService: OffenseService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.offenseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offenseService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.offenseService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.offenseService.update(id, body);
  }

  @Patch(':id/confirmation')
  updateConfirmationStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('confirmation_status') confirmation_status: string,
  ) {
    return this.offenseService.updateConfirmationStatus(id, confirmation_status);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.offenseService.delete(id);
  }
}
