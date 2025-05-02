// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './users/user.entity';
// import { Event } from './event/event.entity';
// import { Member } from './event/member.entity';
// import { AuthModule } from './auth/auth.module';
// import { EventFormModule } from './event/event.module';
// import { MemberModule } from './event/member.module';
// import { AdminModule } from './admin/admin.module';
// import { Admin } from './admin/admin.entity';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),  // Enables use of .env variables globally
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       username: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//       entities: [User, Event, Member, Admin], // ✅ Include all entities here
//       synchronize: true, // Turn off in production
//     }),
//     AuthModule,
//     EventFormModule,
//     MemberModule,
//     AdminModule,
//   ],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Event } from './event/event.entity';
import { Member } from './event/member.entity';
import { Admin } from './admin/admin.entity';
import { AuthModule } from './auth/auth.module';
import { EventFormModule } from './event/event.module';
import { MemberModule } from './event/member.module';
import { AdminModule } from './admin/admin.module';
import { AdminUserModule } from './admin-login/admin-login.module';
import { AdminUser } from './admin-login/entities/admin-login.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env support

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Event, Member, Admin, AdminUser],
      synchronize: process.env.NODE_ENV !== 'production', // safer in dev
      extra: {
        connectionLimit: 10,           // Controls how many connections in the pool
        connectTimeout: 10000,         // Wait 10s before timeout
        idleTimeoutMillis: 30000,      // Idle connection closed after 30s
        enableKeepAlive: true,         // Keeps connection alive
        keepAliveInitialDelay: 10000,  // Delay before first keepAlive ping
      },
    }),

    AuthModule,
    EventFormModule,
    MemberModule,
    AdminModule,
    AdminUserModule,
  ],
})
export class AppModule {}
