import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { AuthModule } from './auth/auth.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { HandoverModule } from './handover/handover.module';
import { WorkshopModule } from './workshop/workshop.module';
import { AccidentModule } from './accident/accident.module';
import { OffenseModule } from './offense/offense.module';
import { MilkywayModule } from './milkyway/milkyway.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    VehicleModule,
    HandoverModule,
    WorkshopModule,
    AccidentModule,
    OffenseModule,
    MilkywayModule,
    DashboardModule,
    AdminModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
