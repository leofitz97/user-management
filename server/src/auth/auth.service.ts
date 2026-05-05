import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as crypto from 'crypto';
import { JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Omit<User, 'password'>; accessToken: string; refreshToken: string }> {
    const user = await this.userService.create(registerDto);
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: this.excludePassword(user),
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || !(await user.comparePassword(loginDto.password))) {
      throw new Error('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      const accessToken = this.generateAccessToken(jwtPayload);
      const refreshToken = this.generateRefreshToken(user.id);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      return null;
    }
    console.log('found')
    return user;
  }

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '15m', secret: process.env.JWT_ACCESS_SECRET });
  }

  private generateRefreshToken(userId: number): string {
    const payload = {
      sub: userId,
      jti: crypto.randomUUID(),
    };
    
    return this.jwtService.sign(payload as any);
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const userObj = user.toJSON();
    const { password, ...result } = userObj;
    return result as Omit<User, 'password'>;
  }
}