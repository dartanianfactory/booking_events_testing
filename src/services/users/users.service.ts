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
    const user = (await this.prisma.user.findUnique({
      where: { email },
    })) as UserType;

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  login(user: UserType) {
    return {
      access_token: this.jwtService.sign(user),
      user,
    };
  }

  async register(email: string, password: string, name?: string) {
    const existingUser = (await this.prisma.user.findUnique({
      where: { email },
    })) as UserType;

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hash = await bcrypt.hash(password, 12);

    const user = (await this.prisma.user.create({
      data: {
        email,
        password: hash,
        name,
      },
    })) as UserType;

    return user;
  }

  async findById(id: number) {
    const user = (await this.prisma.user.findUnique({
      where: { id },
    })) as UserType;

    if (!user) return null;

    return user;
  }
}
