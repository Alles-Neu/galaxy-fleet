import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { paginate, buildPaginatedResponse } from '../common/pagination.dto';

const HANDOVER_INCLUDE = {
  vehicle: { select: { id: true, license_plate: true, model: true } },
  from_employee: { select: { id: true, full_name: true, personnel_number: true } },
  to_employee: { select: { id: true, full_name: true, personnel_number: true } },
  from_station: { select: { id: true, code: true, full_name: true } },
  to_station: { select: { id: true, code: true, full_name: true } },
  created_by: { select: { id: true, username: true } },
};

@Injectable()
export class HandoverService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 25, sort = 'handover_date', order = 'desc',
      vehicle_id, station_id, employee_id, confirmed } = query;

    const where: any = {};
    if (vehicle_id) where.vehicle_id = Number(vehicle_id);
    if (station_id) where.OR = [
      { from_station_id: Number(station_id) },
      { to_station_id: Number(station_id) },
    ];
    if (employee_id) where.OR = [
      ...(where.OR || []),
      { from_employee_id: Number(employee_id) },
      { to_employee_id: Number(employee_id) },
    ];
    if (confirmed !== undefined) where.confirmed = confirmed === 'true';

    const [data, total] = await Promise.all([
      this.prisma.handover.findMany({
        where,
        include: HANDOVER_INCLUDE,
        orderBy: { [sort]: order },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.handover.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async findOne(id: number) {
    const handover = await this.prisma.handover.findUnique({
      where: { id },
      include: HANDOVER_INCLUDE,
    });
    if (!handover) throw new NotFoundException(`Handover ${id} not found`);
    return handover;
  }

  async create(data: any, userId: number) {
    return this.prisma.handover.create({
      data: { ...data, created_by_user_id: userId },
      include: HANDOVER_INCLUDE,
    });
  }

  async update(id: number, data: any) {
    const existing = await this.prisma.handover.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Handover ${id} not found`);
    return this.prisma.handover.update({
      where: { id },
      data,
      include: HANDOVER_INCLUDE,
    });
  }

  async confirm(id: number) {
    const existing = await this.prisma.handover.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Handover ${id} not found`);
    return this.prisma.handover.update({
      where: { id },
      data: { confirmed: true },
      include: HANDOVER_INCLUDE,
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.handover.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Handover ${id} not found`);
    return this.prisma.handover.delete({ where: { id } });
  }
}
