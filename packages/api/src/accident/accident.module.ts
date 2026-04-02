import { Module } from '@nestjs/common';
import { AccidentController } from './accident.controller';
import { AccidentService } from './accident.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [AccidentController],
  providers: [AccidentService, PrismaService],
  exports: [AccidentService],
})
export class AccidentModule {}
