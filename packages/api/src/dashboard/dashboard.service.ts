import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [
      handoversThisMonth,
      accidentsThisMonth,
      toursThisMonth,
      totalVehicles,
      activeVehicles,
      openAccidents,
      openOffenses,
      workshopOrders,
    ] = await Promise.all([
      this.prisma.handover.count({
        where: { handover_date: { gte: monthStart, lte: monthEnd } },
      }),
      this.prisma.accident.count({
        where: { accident_date: { gte: monthStart, lte: monthEnd } },
      }),
      this.prisma.tour.count({
        where: { tour_date: { gte: monthStart, lte: monthEnd } },
      }),
      this.prisma.vehicle.count(),
      this.prisma.vehicle.count({
        where: { status: { name: { in: ['im Einsatz', 'SUB (im Einsatz)'] } } },
      }),
      this.prisma.accident.count({
        where: { status: { not: 'abgearbeitet' } },
      }),
      this.prisma.trafficOffense.count({
        where: { confirmation_status: 'nicht_bestaetigt' },
      }),
      this.prisma.workshopOrder.count({
        where: { status: { not: 'abgeschlossen' } },
      }),
    ]);

    return {
      handovers_this_month: handoversThisMonth,
      accidents_this_month: accidentsThisMonth,
      tours_this_month: toursThisMonth,
      total_vehicles: totalVehicles,
      active_vehicles: activeVehicles,
      open_accidents: openAccidents,
      open_offenses: openOffenses,
      open_workshop_orders: workshopOrders,
    };
  }

  async getStatusDistribution() {
    const statuses = await this.prisma.vehicleStatus.findMany({
      include: { _count: { select: { vehicles: true } } },
      orderBy: { sort_order: 'asc' },
    });

    return statuses.map((s) => ({
      id: s.id,
      name: s.name,
      count: s._count.vehicles,
    }));
  }

  async getAlerts() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Vehicles with high KM (over alarm_odometer)
    const vehiclesNeedingService = await this.prisma.vehicle.findMany({
      where: {
        alarm_odometer: { gt: 0 },
        km_reading: { gte: this.prisma.vehicle.fields.alarm_odometer as any },
      },
      select: { id: true, license_plate: true, km_reading: true, alarm_odometer: true, station: { select: { code: true } } },
      take: 10,
    }).catch(() => []);

    // Vehicles in workshop for long time
    const longWorkshopOrders = await this.prisma.workshopOrder.findMany({
      where: {
        status: { not: 'abgeschlossen' },
        handover_date: { lt: thirtyDaysAgo },
      },
      include: {
        vehicle: { select: { id: true, license_plate: true } },
        to_station: { select: { code: true, full_name: true } },
      },
      take: 10,
    });

    // Unconfirmed handovers older than 7 days
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const unconfirmedHandovers = await this.prisma.handover.count({
      where: { confirmed: false, created_at: { lt: sevenDaysAgo } },
    });

    return {
      vehicles_needing_service: vehiclesNeedingService,
      long_workshop_orders: longWorkshopOrders,
      unconfirmed_handovers_count: unconfirmedHandovers,
    };
  }

  async getTourStatsByStation(query: any) {
    const { month, year } = query;
    const targetYear = year ? Number(year) : new Date().getFullYear();
    const targetMonth = month ? Number(month) - 1 : new Date().getMonth();

    const monthStart = new Date(targetYear, targetMonth, 1);
    const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const stations = await this.prisma.station.findMany({
      select: { id: true, code: true, full_name: true },
      orderBy: { code: 'asc' },
    });

    const result = await Promise.all(
      stations.map(async (station) => {
        const tours = await this.prisma.tour.groupBy({
          by: ['tour_type'],
          where: {
            station_id: station.id,
            tour_date: { gte: monthStart, lte: monthEnd },
          },
          _count: { id: true },
          _sum: { returns_count: true },
        });

        const stats: any = { total: 0, returns: 0 };
        for (const t of tours) {
          stats[t.tour_type] = t._count.id;
          stats.total += t._count.id;
          stats.returns += t._sum.returns_count || 0;
        }

        return { station, ...stats };
      }),
    );

    return result.filter((r) => r.total > 0);
  }
}
