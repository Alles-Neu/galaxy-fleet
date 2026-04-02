import { Module } from '@nestjs/common';
import { OffenseController } from './offense.controller';
import { OffenseService } from './offense.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [OffenseController],
  providers: [OffenseService, PrismaService],
  exports: [OffenseService],
})
export class OffenseModule {}
