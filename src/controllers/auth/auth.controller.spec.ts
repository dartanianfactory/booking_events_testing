import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/database/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockUsersService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return success true with token for valid credentials', async () => {
      const user = { id: 1, email: 'test@test.com', name: 'Test User' };
      const loginResponse = { access_token: 'token', user };

      mockUsersService.validateUser.mockResolvedValue(user);
      mockUsersService.login.mockReturnValue(loginResponse);

      const result = await controller.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result.success).toBe(true);
      expect(result.access_token).toBe('token');
      expect(result.user).toEqual(user);
    });

    it('should return success false for invalid credentials', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      const result = await controller.login({
        email: 'test@test.com',
        password: 'wrongpassword',
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const newUser = { id: 1, email: 'new@test.com', name: 'New User' };
      mockUsersService.register.mockResolvedValue(newUser);

      const result = await controller.register({
        email: 'new@test.com',
        password: 'password',
        name: 'New User',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('User registered successfully');
      expect(result.user).toEqual(newUser);
    });
  });
});