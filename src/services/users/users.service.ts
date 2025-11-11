import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserType } from 'src/types/users/UserType';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user as UserType;
    }
    return null;
  }

  login(user: UserType) {
    const payload = {
      id: user.id,
      user_id: user.user_id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hash = await bcrypt.hash(password, 12);

    const user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const user = await this.prisma.user.create({
      data: {
        user_id,
        email,
        password: hash,
        name,
      },
    });

    return user;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return user;
  }
}
