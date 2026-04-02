import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { paginate, buildPaginatedResponse } from '../common/pagination.dto';

const VEHICLE_INCLUDE = {
  brand: true,
  company: true,
  station: true,
  status: true,
  procurement_type: true,
  insurance_company: true,
};

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const {
      page = 1, limit = 25, sort = 'id', order = 'asc',
      search, status_id, station_id, company_id, brand_id, service_vehicle,
    } = query;

    const where: any = {};
    if (search) {
      where.OR = [
        { license_plate: { contains: search, mode: 'insensitive' } },
        { fin: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status_id) where.status_id = Number(status_id);
    if (station_id) where.station_id = Number(station_id);
    if (company_id) where.company_id = Number(company_id);
    if (brand_id) where.brand_id = Number(brand_id);
    if (service_vehicle !== undefined) where.service_vehicle = service_vehicle === 'true';

    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        include: VEHICLE_INCLUDE,
        orderBy: { [sort]: order },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async findOne(id: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        ...VEHICLE_INCLUDE,
        _count: {
          select: {
            handovers: true,
            workshop_orders: true,
            accidents: true,
            offenses: true,
            documents: true,
            tickets: true,
          },
        },
      },
    });
    if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`);
    return vehicle;
  }

  async create(data: any, userId: number) {
    return this.prisma.vehicle.create({
      data,
      include: VEHICLE_INCLUDE,
    });
  }

  async update(id: number, data: any, userId: number) {
    const existing = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Vehicle ${id} not found`);

    // Log changes
    const changes: any[] = [];
    const trackFields = [
      'status_id', 'station_id', 'company_id', 'km_reading',
      'license_plate', 'model', 'brand_id',
    ];
    for (const field of trackFields) {
      if (data[field] !== undefined && data[field] !== existing[field]) {
        changes.push({
          vehicle_id: id,
          field_name: field,
          old_value: String(existing[field] ?? ''),
          new_value: String(data[field] ?? ''),
          changed_by_user_id: userId,
        });
      }
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.vehicle.update({ where: { id }, data, include: VEHICLE_INCLUDE }),
      ...(changes.length > 0
        ? [this.prisma.changeLog.createMany({ data: changes })]
        : []),
    ]);

    return updated;
  }

  // Sub-resources
  async getDocuments(vehicleId: number, query: any) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException();
    const { page = 1, limit = 25 } = query;
    const [data, total] = await Promise.all([
      this.prisma.document.findMany({
        where: { vehicle_id: vehicleId },
        include: { document_type: true, uploaded_by: { select: { id: true, username: true } } },
        orderBy: { created_at: 'desc' },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.document.count({ where: { vehicle_id: vehicleId } }),
    ]);
    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async createDocument(vehicleId: number, data: any, userId: number) {
    return this.prisma.document.create({
      data: { ...data, vehicle_id: vehicleId, uploaded_by_user_id: userId },
      include: { document_type: true },
    });
  }

  async getImages(vehicleId: number) {
    return this.prisma.vehicleImage.findMany({
      where: { vehicle_id: vehicleId },
      include: { uploaded_by: { select: { id: true, username: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async createImage(vehicleId: number, data: any, userId: number) {
    return this.prisma.vehicleImage.create({
      data: { ...data, vehicle_id: vehicleId, uploaded_by_user_id: userId },
    });
  }

  async getFuelRecords(vehicleId: number, query: any) {
    const { page = 1, limit = 25 } = query;
    const [data, total] = await Promise.all([
      this.prisma.fuelRecord.findMany({
        where: { vehicle_id: vehicleId },
        orderBy: { record_date: 'desc' },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.fuelRecord.count({ where: { vehicle_id: vehicleId } }),
    ]);
    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async createFuelRecord(vehicleId: number, data: any) {
    return this.prisma.fuelRecord.create({
      data: { ...data, vehicle_id: vehicleId },
    });
  }

  async getServiceRecords(vehicleId: number, query: any) {
    const { page = 1, limit = 25 } = query;
    const [data, total] = await Promise.all([
      this.prisma.serviceRecord.findMany({
        where: { vehicle_id: vehicleId },
        orderBy: { service_date: 'desc' },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.serviceRecord.count({ where: { vehicle_id: vehicleId } }),
    ]);
    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async createServiceRecord(vehicleId: number, data: any) {
    return this.prisma.serviceRecord.create({
      data: { ...data, vehicle_id: vehicleId },
    });
  }

  async getChangelog(vehicleId: number, query: any) {
    const { page = 1, limit = 50 } = query;
    const [data, total] = await Promise.all([
      this.prisma.changeLog.findMany({
        where: { vehicle_id: vehicleId },
        include: { changed_by: { select: { id: true, username: true } } },
        orderBy: { changed_at: 'desc' },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.changeLog.count({ where: { vehicle_id: vehicleId } }),
    ]);
    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async getTickets(vehicleId: number, query: any) {
    const { page = 1, limit = 25 } = query;
    const [data, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where: { vehicle_id: vehicleId },
        include: { created_by: { select: { id: true, username: true } } },
        orderBy: { created_at: 'desc' },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.ticket.count({ where: { vehicle_id: vehicleId } }),
    ]);
    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  async createTicket(vehicleId: number, data: any, userId: number) {
    return this.prisma.ticket.create({
      data: { ...data, vehicle_id: vehicleId, created_by_user_id: userId },
      include: { created_by: { select: { id: true, username: true } } },
    });
  }
}
