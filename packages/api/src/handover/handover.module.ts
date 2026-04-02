import { Module } from '@nestjs/common';
import { HandoverController } from './handover.controller';
import { HandoverService } from './handover.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [HandoverController],
  providers: [HandoverService, PrismaService],
  exports: [HandoverService],
})
export class HandoverModule {}
