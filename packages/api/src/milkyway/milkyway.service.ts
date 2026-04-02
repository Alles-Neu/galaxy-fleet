import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

const TOUR_INCLUDE = {
  station: { select: { id: true, code: true, full_name: true } },
  employee: { select: { id: true, full_name: true, personnel_number: true } },
  vehicle: { select: { id: true, license_plate: true, model: true } },
  absence_type: true,
  support_station: { select: { id: true, code: true, full_name: true } },
};

@Injectable()
export class MilkywayService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyTours(stationCode: string, date: string) {
    const station = await this.prisma.station.findUnique({ where: { code: stationCode } });
    if (!station) throw new NotFoundException(`Station ${stationCode} not found`);

    const tourDate = date ? new Date(date) : new Date();
    const dayStart = new Date(tourDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(tourDate);
    dayEnd.setHours(23, 59, 59, 999);

    const tours = await this.prisma.tour.findMany({
      where: {
        station_id: station.id,
        tour_date: { gte: dayStart, lte: dayEnd },
      },
      include: TOUR_INCLUDE,
      orderBy: { tour_number: 'asc' },
    });

    const stats = {
      total: tours.length,
      normal: tours.filter((t) => t.tour_type === 'normal').length,
      extra: tours.filter((t) => t.tour_type === 'extra').length,
      rescue: tours.filter((t) => t.tour_type === 'rescue').length,
      absent: tours.filter((t) => t.tour_type === 'absent').length,
      total_returns: tours.reduce((sum, t) => sum + t.returns_count, 0),
    };

    return { station, date: tourDate, tours, stats };
  }

  async createTour(data: any) {
    return this.prisma.tour.create({
      data,
      include: TOUR_INCLUDE,
    });
  }

  async updateTour(id: number, data: any) {
    const existing = await this.prisma.tour.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Tour ${id} not found`);
    return this.prisma.tour.update({ where: { id }, data, include: TOUR_INCLUDE });
  }

  async deleteTour(id: number) {
    const existing = await this.prisma.tour.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Tour ${id} not found`);
    return this.prisma.tour.delete({ where: { id } });
  }

  async getWowStats(stationCode: string, date: string) {
    const station = await this.prisma.station.findUnique({ where: { code: stationCode } });
    if (!station) throw new NotFoundException(`Station ${stationCode} not found`);

    const targetDate = date ? new Date(date) : new Date();
    const weeks: any[] = [];

    for (let w = 0; w < 4; w++) {
      const weekStart = new Date(targetDate);
      weekStart.setDate(weekStart.getDate() - (w * 7));
      const dayOfWeek = weekStart.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(weekStart.getDate() + mondayOffset);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const tours = await this.prisma.tour.findMany({
        where: {
          station_id: station.id,
          tour_date: { gte: weekStart, lte: weekEnd },
        },
      });

      const days: any[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + d);
        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);

        const dayTours = tours.filter((t) => {
          const td = new Date(t.tour_date);
          return td >= day && td <= dayEnd;
        });

        days.push({
          date: day.toISOString().split('T')[0],
          total: dayTours.length,
          returns: dayTours.reduce((sum, t) => sum + t.returns_count, 0),
        });
      }

      weeks.push({
        week: w + 1,
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0],
        days,
        total: tours.length,
        total_returns: tours.reduce((sum, t) => sum + t.returns_count, 0),
      });
    }

    return { station, weeks: weeks.reverse() };
  }

  async getAgeing(stationCode: string) {
    const station = await this.prisma.station.findUnique({ where: { code: stationCode } });
    if (!station) throw new NotFoundException(`Station ${stationCode} not found`);

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const overdueTours = await this.prisma.tour.findMany({
      where: {
        station_id: station.id,
        tour_date: { lt: sevenDaysAgo },
        returns_count: { gt: 0 },
      },
      include: TOUR_INCLUDE,
      orderBy: { tour_date: 'asc' },
    });

    return {
      station,
      overdue_count: overdueTours.length,
      tours: overdueTours,
    };
  }

  async search(query: any) {
    const { q, station_id, tour_type, date_from, date_to, page = 1, limit = 25 } = query;

    const where: any = {};
    if (q) {
      where.OR = [
        { tour_number: { contains: q, mode: 'insensitive' } },
        { employee: { full_name: { contains: q, mode: 'insensitive' } } },
        { vehicle: { license_plate: { contains: q, mode: 'insensitive' } } },
      ];
    }
    if (station_id) where.station_id = Number(station_id);
    if (tour_type) where.tour_type = tour_type;
    if (date_from || date_to) {
      where.tour_date = {};
      if (date_from) where.tour_date.gte = new Date(date_from);
      if (date_to) where.tour_date.lte = new Date(date_to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      this.prisma.tour.findMany({
        where,
        include: TOUR_INCLUDE,
        orderBy: { tour_date: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.tour.count({ where }),
    ]);

    return {
      data,
      meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    };
  }
}
