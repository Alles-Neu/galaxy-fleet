import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { paginate, buildPaginatedResponse } from '../common/pagination.dto';

const OFFENSE_INCLUDE = {
  vehicle: { select: { id: true, license_plate: true, model: true } },
  offense_type: true,
  authority: true,
};

@Injectable()
export class OffenseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 25, sort = 'offense_date', order = 'desc',
      confirmation_status, offense_type_id, authority_id, vehicle_id,
      date_from, date_to, search } = query;

    const where: any = {};
    if (confirmation_status) where.confirmation_status = confirmation_status;
    if (offense_type_id) where.offense_type_id = Number(offense_type_id);
    if (authority_id) where.authority_id = Number(authority_id);
    if (vehicle_id) where.vehicle_id = Number(vehicle_id);
    if (search) {
      where.OR = [
        { driver_name: { contains: search, mode: 'insensitive' } },
        { personnel_number: { contains: search, mode: 'insensitive' } },
        { reference_number: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (date_from || date_to) {
      where.offense_date = {};
      if (date_from) where.offense_date.gte = new Date(date_from);
      if (date_to) where.offense_date.lte = new Date(date_to);
    }

    const [data, total] = await Promise.all([
      this.prisma.trafficOffense.findMany({
        where,
        include: OFFENSE_INCLUDE,
        orderBy: { [sort]: order },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.trafficOffense.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async findOne(id: number) {
    const offense = await this.prisma.trafficOffense.findUnique({
      where: { id },
      include: OFFENSE_INCLUDE,
    });
    if (!offense) throw new NotFoundException(`Offense ${id} not found`);
    return offense;
  }

  async create(data: any) {
    return this.prisma.trafficOffense.create({
      data,
      include: OFFENSE_INCLUDE,
    });
  }

  async update(id: number, data: any) {
    const existing = await this.prisma.trafficOffense.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Offense ${id} not found`);
    return this.prisma.trafficOffense.update({
      where: { id },
      data,
      include: OFFENSE_INCLUDE,
    });
  }

  async updateConfirmationStatus(id: number, confirmation_status: string) {
    const existing = await this.prisma.trafficOffense.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Offense ${id} not found`);
    return this.prisma.trafficOffense.update({
      where: { id },
      data: { confirmation_status },
      include: OFFENSE_INCLUDE,
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.trafficOffense.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Offense ${id} not found`);
    return this.prisma.trafficOffense.delete({ where: { id } });
  }
}
