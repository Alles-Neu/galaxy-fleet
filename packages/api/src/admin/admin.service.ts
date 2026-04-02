import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { paginate, buildPaginatedResponse } from '../common/pagination.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Master Data ─────────────────────────────────────────────────────────────

  // Vehicle Statuses
  async getStatuses() {
    return this.prisma.vehicleStatus.findMany({ orderBy: { sort_order: 'asc' } });
  }
  async createStatus(data: any) {
    return this.prisma.vehicleStatus.create({ data });
  }
  async updateStatus(id: number, data: any) {
    return this.prisma.vehicleStatus.update({ where: { id }, data });
  }
  async deleteStatus(id: number) {
    return this.prisma.vehicleStatus.delete({ where: { id } });
  }

  // Brands
  async getBrands() {
    return this.prisma.vehicleBrand.findMany({
      include: { models: true },
      orderBy: { name: 'asc' },
    });
  }
  async createBrand(data: any) {
    return this.prisma.vehicleBrand.create({ data });
  }
  async updateBrand(id: number, data: any) {
    return this.prisma.vehicleBrand.update({ where: { id }, data });
  }
  async deleteBrand(id: number) {
    return this.prisma.vehicleBrand.delete({ where: { id } });
  }

  // Models
  async getModels(brandId?: number) {
    return this.prisma.vehicleModel.findMany({
      where: brandId ? { brand_id: brandId } : undefined,
      include: { brand: true },
      orderBy: { name: 'asc' },
    });
  }
  async createModel(data: any) {
    return this.prisma.vehicleModel.create({ data, include: { brand: true } });
  }
  async updateModel(id: number, data: any) {
    return this.prisma.vehicleModel.update({ where: { id }, data, include: { brand: true } });
  }
  async deleteModel(id: number) {
    return this.prisma.vehicleModel.delete({ where: { id } });
  }

  // Document Types
  async getDocumentTypes() {
    return this.prisma.documentType.findMany({ orderBy: { name: 'asc' } });
  }
  async createDocumentType(data: any) {
    return this.prisma.documentType.create({ data });
  }
  async updateDocumentType(id: number, data: any) {
    return this.prisma.documentType.update({ where: { id }, data });
  }
  async deleteDocumentType(id: number) {
    return this.prisma.documentType.delete({ where: { id } });
  }

  // Insurance Companies
  async getInsuranceCompanies() {
    return this.prisma.insuranceCompany.findMany({ orderBy: { name: 'asc' } });
  }
  async createInsuranceCompany(data: any) {
    return this.prisma.insuranceCompany.create({ data });
  }
  async updateInsuranceCompany(id: number, data: any) {
    return this.prisma.insuranceCompany.update({ where: { id }, data });
  }
  async deleteInsuranceCompany(id: number) {
    return this.prisma.insuranceCompany.delete({ where: { id } });
  }

  // Procurement Types
  async getProcurementTypes() {
    return this.prisma.procurementType.findMany({ orderBy: { name: 'asc' } });
  }
  async createProcurementType(data: any) {
    return this.prisma.procurementType.create({ data });
  }
  async updateProcurementType(id: number, data: any) {
    return this.prisma.procurementType.update({ where: { id }, data });
  }
  async deleteProcurementType(id: number) {
    return this.prisma.procurementType.delete({ where: { id } });
  }

  // Offense Types
  async getOffenseTypes() {
    return this.prisma.offenseType.findMany({ orderBy: { name: 'asc' } });
  }
  async createOffenseType(data: any) {
    return this.prisma.offenseType.create({ data });
  }
  async updateOffenseType(id: number, data: any) {
    return this.prisma.offenseType.update({ where: { id }, data });
  }
  async deleteOffenseType(id: number) {
    return this.prisma.offenseType.delete({ where: { id } });
  }

  // Offense Authorities
  async getOffenseAuthorities() {
    return this.prisma.offenseAuthority.findMany({ orderBy: { name: 'asc' } });
  }
  async createOffenseAuthority(data: any) {
    return this.prisma.offenseAuthority.create({ data });
  }
  async updateOffenseAuthority(id: number, data: any) {
    return this.prisma.offenseAuthority.update({ where: { id }, data });
  }
  async deleteOffenseAuthority(id: number) {
    return this.prisma.offenseAuthority.delete({ where: { id } });
  }

  // Fault Types
  async getFaultTypes() {
    return this.prisma.faultType.findMany({ orderBy: { name: 'asc' } });
  }
  async createFaultType(data: any) {
    return this.prisma.faultType.create({ data });
  }
  async updateFaultType(id: number, data: any) {
    return this.prisma.faultType.update({ where: { id }, data });
  }
  async deleteFaultType(id: number) {
    return this.prisma.faultType.delete({ where: { id } });
  }

  // Accident Processing Statuses
  async getAccidentProcessingStatuses() {
    return this.prisma.accidentProcessingStatus.findMany({ orderBy: { name: 'asc' } });
  }
  async createAccidentProcessingStatus(data: any) {
    return this.prisma.accidentProcessingStatus.create({ data });
  }
  async updateAccidentProcessingStatus(id: number, data: any) {
    return this.prisma.accidentProcessingStatus.update({ where: { id }, data });
  }
  async deleteAccidentProcessingStatus(id: number) {
    return this.prisma.accidentProcessingStatus.delete({ where: { id } });
  }

  // Absence Types
  async getAbsenceTypes() {
    return this.prisma.absenceType.findMany({ orderBy: { name: 'asc' } });
  }
  async createAbsenceType(data: any) {
    return this.prisma.absenceType.create({ data });
  }
  async updateAbsenceType(id: number, data: any) {
    return this.prisma.absenceType.update({ where: { id }, data });
  }
  async deleteAbsenceType(id: number) {
    return this.prisma.absenceType.delete({ where: { id } });
  }

  // ─── Companies ────────────────────────────────────────────────────────────────

  async getCompanies() {
    return this.prisma.company.findMany({
      include: { station: true },
      orderBy: { name: 'asc' },
    });
  }
  async createCompany(data: any) {
    return this.prisma.company.create({ data });
  }
  async updateCompany(id: number, data: any) {
    return this.prisma.company.update({ where: { id }, data });
  }
  async deleteCompany(id: number) {
    return this.prisma.company.delete({ where: { id } });
  }

  // ─── Stations ─────────────────────────────────────────────────────────────────

  async getStations(query: any) {
    const { company_id, type, client } = query;
    const where: any = {};
    if (company_id) where.company_id = Number(company_id);
    if (type) where.type = type;
    if (client) where.client = client;
    return this.prisma.station.findMany({
      where,
      include: { company: true },
      orderBy: { code: 'asc' },
    });
  }
  async createStation(data: any) {
    return this.prisma.station.create({ data, include: { company: true } });
  }
  async updateStation(id: number, data: any) {
    return this.prisma.station.update({ where: { id }, data, include: { company: true } });
  }
  async deleteStation(id: number) {
    return this.prisma.station.delete({ where: { id } });
  }

  // ─── Employees ────────────────────────────────────────────────────────────────

  async getEmployees(query: any) {
    const { company_id, active, search, page = 1, limit = 50 } = query;
    const where: any = {};
    if (company_id) where.company_id = Number(company_id);
    if (active !== undefined) where.active = active === 'true';
    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { personnel_number: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        include: { company: true },
        orderBy: { full_name: 'asc' },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.employee.count({ where }),
    ]);
    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }
  async createEmployee(data: any) {
    return this.prisma.employee.create({ data, include: { company: true } });
  }
  async updateEmployee(id: number, data: any) {
    return this.prisma.employee.update({ where: { id }, data, include: { company: true } });
  }
  async deleteEmployee(id: number) {
    return this.prisma.employee.delete({ where: { id } });
  }

  // ─── Users ────────────────────────────────────────────────────────────────────

  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, role: true, active: true, created_at: true,
        stations: { include: { station: true } } },
      orderBy: { username: 'asc' },
    });
  }

  async createUser(data: any) {
    const { password, station_ids, ...rest } = data;
    const password_hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        ...rest,
        password_hash,
        ...(station_ids?.length ? {
          stations: { create: station_ids.map((sid: number) => ({ station_id: sid })) },
        } : {}),
      },
      select: { id: true, username: true, role: true, active: true, created_at: true,
        stations: { include: { station: true } } },
    });
  }

  async updateUser(id: number, data: any) {
    const { password, station_ids, ...rest } = data;
    const updates: any = { ...rest };
    if (password) updates.password_hash = await bcrypt.hash(password, 10);

    if (station_ids !== undefined) {
      await this.prisma.userStation.deleteMany({ where: { user_id: id } });
      if (station_ids.length > 0) {
        await this.prisma.userStation.createMany({
          data: station_ids.map((sid: number) => ({ user_id: id, station_id: sid })),
        });
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updates,
      select: { id: true, username: true, role: true, active: true, created_at: true,
        stations: { include: { station: true } } },
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  // ─── Change Logs ──────────────────────────────────────────────────────────────

  async getLogs(query: any) {
    const { page = 1, limit = 50, vehicle_id, user_id, field_name, date_from, date_to } = query;
    const where: any = {};
    if (vehicle_id) where.vehicle_id = Number(vehicle_id);
    if (user_id) where.changed_by_user_id = Number(user_id);
    if (field_name) where.field_name = field_name;
    if (date_from || date_to) {
      where.changed_at = {};
      if (date_from) where.changed_at.gte = new Date(date_from);
      if (date_to) where.changed_at.lte = new Date(date_to);
    }

    const [data, total] = await Promise.all([
      this.prisma.changeLog.findMany({
        where,
        include: {
          vehicle: { select: { id: true, license_plate: true } },
          changed_by: { select: { id: true, username: true } },
        },
        orderBy: { changed_at: 'desc' },
        ...paginate(Number(page), Number(limit)),
      }),
      this.prisma.changeLog.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, Number(page), Number(limit));
  }

  // ─── All master data grouped ──────────────────────────────────────────────────

  async getAllMasterData() {
    const [
      statuses, brands, documentTypes, insuranceCompanies, procurementTypes,
      offenseTypes, offenseAuthorities, faultTypes, accidentProcessingStatuses,
      absenceTypes, companies, stations,
    ] = await Promise.all([
      this.getStatuses(),
      this.getBrands(),
      this.getDocumentTypes(),
      this.getInsuranceCompanies(),
      this.getProcurementTypes(),
      this.getOffenseTypes(),
      this.getOffenseAuthorities(),
      this.getFaultTypes(),
      this.getAccidentProcessingStatuses(),
      this.getAbsenceTypes(),
      this.getCompanies(),
      this.getStations({}),
    ]);

    return {
      statuses,
      brands,
      document_types: documentTypes,
      insurance_companies: insuranceCompanies,
      procurement_types: procurementTypes,
      offense_types: offenseTypes,
      offense_authorities: offenseAuthorities,
      fault_types: faultTypes,
      accident_processing_statuses: accidentProcessingStatuses,
      absence_types: absenceTypes,
      companies,
      stations,
    };
  }
}
