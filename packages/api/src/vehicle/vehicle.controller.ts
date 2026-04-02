import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.vehicleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.findOne(id);
  }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.vehicleService.create(body, req.user.id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Request() req: any) {
    return this.vehicleService.update(id, body, req.user.id);
  }

  // Documents
  @Get(':id/documents')
  getDocuments(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.vehicleService.getDocuments(id, query);
  }

  @Post(':id/documents')
  createDocument(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Request() req: any) {
    return this.vehicleService.createDocument(id, body, req.user.id);
  }

  // Images
  @Get(':id/images')
  getImages(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.getImages(id);
  }

  @Post(':id/images')
  createImage(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Request() req: any) {
    return this.vehicleService.createImage(id, body, req.user.id);
  }

  // Fuel Records
  @Get(':id/fuel-records')
  getFuelRecords(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.vehicleService.getFuelRecords(id, query);
  }

  @Post(':id/fuel-records')
  createFuelRecord(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.vehicleService.createFuelRecord(id, body);
  }

  // Service Records
  @Get(':id/service-records')
  getServiceRecords(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.vehicleService.getServiceRecords(id, query);
  }

  @Post(':id/service-records')
  createServiceRecord(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.vehicleService.createServiceRecord(id, body);
  }

  // Changelog
  @Get(':id/changelog')
  getChangelog(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.vehicleService.getChangelog(id, query);
  }

  // Tickets
  @Get(':id/tickets')
  getTickets(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.vehicleService.getTickets(id, query);
  }

  @Post(':id/tickets')
  createTicket(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Request() req: any) {
    return this.vehicleService.createTicket(id, body, req.user.id);
  }
}
