import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  getKpis() {
    return this.dashboardService.getKpis();
  }

  @Get('status-distribution')
  getStatusDistribution() {
    return this.dashboardService.getStatusDistribution();
  }

  @Get('alerts')
  getAlerts() {
    return this.dashboardService.getAlerts();
  }

  @Get('tour-stats')
  getTourStats(@Query() query: any) {
    return this.dashboardService.getTourStatsByStation(query);
  }
}
