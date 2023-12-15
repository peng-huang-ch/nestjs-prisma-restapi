import { Module } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { PrismaModule } from '@src/prisma';

import { UsersService } from './users';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class ServicesModule {}
