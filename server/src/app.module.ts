import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'trepyal',
      database: process.env.DB_DATABASE || 'user_management_db',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
      // ssl: process.env.DB_SSL === 'true',
      // dialectOptions: process.env.DB_SSL === 'true' ? {
      //   ssl: {
      //     require: true,
      //     rejectUnauthorized: false,
      //   },
      // } : {},
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
