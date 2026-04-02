import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MilkywayService } from './milkyway.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('milkyway')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('milkyway')
export class MilkywayController {
  constructor(private readonly milkywayService: MilkywayService) {}

  @Get('stations/:code/daily')
  getDailyTours(@Param('code') code: string, @Query('date') date: string) {
    return this.milkywayService.getDailyTours(code, date);
  }

  @Post('tours')
  createTour(@Body() body: any) {
    return this.milkywayService.createTour(body);
  }

  @Patch('tours/:id')
  updateTour(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.milkywayService.updateTour(id, body);
  }

  @Delete('tours/:id')
  deleteTour(@Param('id', ParseIntPipe) id: number) {
    return this.milkywayService.deleteTour(id);
  }

  @Get('stations/:code/wow')
  getWowStats(@Param('code') code: string, @Query('date') date: string) {
    return this.milkywayService.getWowStats(code, date);
  }

  @Get('stations/:code/ageing')
  getAgeing(@Param('code') code: string) {
    return this.milkywayService.getAgeing(code);
  }

  @Get('search')
  search(@Query() query: any) {
    return this.milkywayService.search(query);
  }
}
