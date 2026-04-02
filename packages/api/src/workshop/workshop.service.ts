import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { paginate, buildPaginatedResponse } from '../common/pagination.dto';

const WORKSHOP_INCLUDE = {
  vehicle: { select: { id: true, license_plate: true, model: true } },
  from_employee: { select: { id: true, full_name: true, personnel_number: true } },
  to_employee: { select: { id: true, full_name: true, personnel_number: true } },
  from_station: { select: { id: true, code: true, full_name: true } },
  to_station: { select: { id: true, code: true, full_name: true } },
  created_by: { select: { id: true, username: true } },
};

@Injectable()
export class WorkshopService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 25, sort = 'handover_date', order = 'desc',
      vehicle_id, station_id, employee_id, status } = query;

    const where: any = {};
    if (vehicle_id) where.vehicle_id = Number(vehicle_id);
    if (status) where.status = status;
    if (station_id) where.OR = [
      { from_station_id: Number(station_id) },
      { to_station_id: Number(station_id) },
    ];
    if (employee_id) {
      where.OR = [
        ...(where.OR || []),
        { from_employee_id: Number(employee_id) },
        { to_employee_id: Number(employee_id) },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.workshopOrder.findMany({
        where,
        include: WORKSHOP_INCLUDE,
        orderBy: { [sort]: order },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.workshopOrder.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async findOne(id: number) {
    const order = await this.prisma.workshopOrder.findUnique({
      where: { id },
      include: WORKSHOP_INCLUDE,
    });
    if (!order) throw new NotFoundException(`Workshop order ${id} not found`);
    return order;
  }

  async create(data: any, userId: number) {
    return this.prisma.workshopOrder.create({
      data: { ...data, created_by_user_id: userId },
      include: WORKSHOP_INCLUDE,
    });
  }

  async update(id: number, data: any) {
    const existing = await this.prisma.workshopOrder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Workshop order ${id} not found`);
    return this.prisma.workshopOrder.update({
      where: { id },
      data,
      include: WORKSHOP_INCLUDE,
    });
  }

  async updateStatus(id: number, status: string) {
    const existing = await this.prisma.workshopOrder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Workshop order ${id} not found`);
    const validStatuses = ['neu', 'geprueft', 'abgeschlossen'];
    if (!validStatuses.includes(status)) {
      throw new NotFoundException(`Invalid status: ${status}`);
    }
    return this.prisma.workshopOrder.update({
      where: { id },
      data: { status },
      include: WORKSHOP_INCLUDE,
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.workshopOrder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Workshop order ${id} not found`);
    return this.prisma.workshopOrder.delete({ where: { id } });
  }
}
