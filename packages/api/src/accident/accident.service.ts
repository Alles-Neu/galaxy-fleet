import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { paginate, buildPaginatedResponse } from '../common/pagination.dto';

const ACCIDENT_INCLUDE = {
  vehicle: { select: { id: true, license_plate: true, model: true } },
  station: { select: { id: true, code: true, full_name: true } },
  processing_status: true,
  fault_type: true,
};

@Injectable()
export class AccidentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 25, sort = 'accident_date', order = 'desc',
      status, fault_type_id, station_id, vehicle_id, date_from, date_to } = query;

    const where: any = {};
    if (status) where.status = status;
    if (fault_type_id) where.fault_type_id = Number(fault_type_id);
    if (station_id) where.station_id = Number(station_id);
    if (vehicle_id) where.vehicle_id = Number(vehicle_id);
    if (date_from || date_to) {
      where.accident_date = {};
      if (date_from) where.accident_date.gte = new Date(date_from);
      if (date_to) where.accident_date.lte = new Date(date_to);
    }

    const [data, total] = await Promise.all([
      this.prisma.accident.findMany({
        where,
        include: ACCIDENT_INCLUDE,
        orderBy: { [sort]: order },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.accident.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async findOne(id: number) {
    const accident = await this.prisma.accident.findUnique({
      where: { id },
      include: ACCIDENT_INCLUDE,
    });
    if (!accident) throw new NotFoundException(`Accident ${id} not found`);
    return accident;
  }

  async create(data: any) {
    return this.prisma.accident.create({
      data,
      include: ACCIDENT_INCLUDE,
    });
  }

  async update(id: number, data: any) {
    const existing = await this.prisma.accident.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Accident ${id} not found`);
    return this.prisma.accident.update({
      where: { id },
      data,
      include: ACCIDENT_INCLUDE,
    });
  }

  async updateStatus(id: number, status: string, processing_status_id?: number) {
    const existing = await this.prisma.accident.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Accident ${id} not found`);
    return this.prisma.accident.update({
      where: { id },
      data: { status, ...(processing_status_id ? { processing_status_id } : {}) },
      include: ACCIDENT_INCLUDE,
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.accident.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Accident ${id} not found`);
    return this.prisma.accident.delete({ where: { id } });
  }
}
