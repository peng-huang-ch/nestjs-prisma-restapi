import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import extension from 'prisma-paginate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('prisma');
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
    // this.$extends(extension);
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('query' as never, (e: Prisma.QueryEvent) => {
      this.logger.log(e);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
