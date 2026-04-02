import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WorkshopService } from './workshop.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('workshop')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workshop')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.workshopService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workshopService.findOne(id);
  }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.workshopService.create(body, req.user.id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.workshopService.update(id, body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.workshopService.updateStatus(id, status);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.workshopService.delete(id);
  }
}
