import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { UsersService } from 'src/services/users/users.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'testing',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, UsersService],
  exports: [JwtModule, UsersService],
})
export class AuthModule {}
