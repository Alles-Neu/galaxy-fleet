import { Module } from '@nestjs/common';
import { MilkywayController } from './milkyway.controller';
import { MilkywayService } from './milkyway.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [MilkywayController],
  providers: [MilkywayService, PrismaService],
  exports: [MilkywayService],
})
export class MilkywayModule {}
