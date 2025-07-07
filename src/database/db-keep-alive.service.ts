import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbKeepAliveService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    setInterval(async () => {
      try {
        await this.dataSource.query('SELECT 1');
        console.log('[MySQL KeepAlive] Ping sent');
      } catch (error) {
        console.error('[MySQL KeepAlive] Ping failed:', error);
      }
    }, 5 * 60 * 1000); // every 5 minutes
  }
}
