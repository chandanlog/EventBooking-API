// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: process.env.DB_HOST || 'localhost',
//       port: Number(process.env.DB_PORT) || 3306,
//       username: process.env.DB_USER || 'root',
//       password: process.env.DB_PASS || 'root',
//       database: process.env.DB_NAME || 'eventbooking',
//       autoLoadEntities: true,
//       synchronize: true, // Set to false in production
//     }),
//   ],
// })
// export class DatabaseModule {}
// src/database/database.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { DbKeepAliveService } from './db-keep-alive.service';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: process.env.DB_HOST || 'localhost',
//       port: Number(process.env.DB_PORT) || 3306,
//       username: process.env.DB_USER || 'root',
//       password: process.env.DB_PASS || 'root',
//       database: process.env.DB_NAME || 'eventbooking',
//       autoLoadEntities: true,
//       synchronize: true, // ❗ Set to false in production
//       retryAttempts: 5,
//       retryDelay: 3000,
//     }),
//   ],
//   providers: [DbKeepAliveService],
// })
// export class DatabaseModule {}

import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS ,
      database: process.env.DB_NAME ,
      autoLoadEntities: true,
      synchronize: true, // ❗ Set to false in production
      retryAttempts: 5,
      retryDelay: 3000,
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    // Run a keep-alive query every 5 minutes
    setInterval(async () => {
      try {
        await this.dataSource.query('SELECT 1');
        console.log('✅ Keep-alive query sent');
      } catch (error) {
        console.error('❌ Keep-alive query failed:', error);
      }
    }, 300_000); // 5 minutes
  }
}
