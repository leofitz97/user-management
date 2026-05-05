import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      } as User;

      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');

      const result = await service.register(registerDto);

      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(result.user.name).toBe('John Doe');
      expect(result.user.email).toBe('john@example.com');
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
      } as any;

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');

      const result = await service.login(loginDto);

      expect(userService.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(result.user.name).toBe('John Doe');
    });

    it('should throw error for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(false),
      } as any;

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});