import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const user = new User();
    user.name = registerDto.name;
    user.email = registerDto.email;
    user.password = registerDto.password;
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async update(id: number, updateData: Partial<RegisterDto>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }
    return user.update(updateData);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userModel.destroy({ where: { id } });
    return result > 0;
  }
}