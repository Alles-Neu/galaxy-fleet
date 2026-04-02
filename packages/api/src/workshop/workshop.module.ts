import { Module } from '@nestjs/common';
import { WorkshopController } from './workshop.controller';
import { WorkshopService } from './workshop.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [WorkshopController],
  providers: [WorkshopService, PrismaService],
  exports: [WorkshopService],
})
export class WorkshopModule {}
