import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HandoverService } from './handover.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('handovers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('handovers')
export class HandoverController {
  constructor(private readonly handoverService: HandoverService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.handoverService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.handoverService.findOne(id);
  }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.handoverService.create(body, req.user.id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.handoverService.update(id, body);
  }

  @Post(':id/confirm')
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.handoverService.confirm(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.handoverService.delete(id);
  }
}
