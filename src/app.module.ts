import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule } from 'nestjs-pino';

import { ApiModule } from '@src/api/api.module';
import { getLoggerOption } from '@src/config';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => getLoggerOption(configService),
      inject: [ConfigService],
    }),
    ApiModule,
  ],
})
export class AppModule {}
