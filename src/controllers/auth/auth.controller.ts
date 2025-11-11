import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/services/users/users.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const { email, password } = loginData;

    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    return {
      success: true,
      ...this.usersService.login(user),
    };
  }

  @Post('register')
  async register(
    @Body() registerData: { email: string; password: string; name?: string },
  ) {
    try {
      const { email, password, name } = registerData;
      const user = await this.usersService.register(email, password, name);

      return {
        success: true,
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message as string,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getCurrentUser(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    return {
      success: true,
      user,
    };
  }
}