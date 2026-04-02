import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        stations: { include: { station: true } },
      },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        stations: user.stations.map((us) => us.station),
      },
    };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        stations: { include: { station: true } },
      },
    });
    if (!user) throw new UnauthorizedException();
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      stations: user.stations.map((us) => us.station),
    };
  }
}
