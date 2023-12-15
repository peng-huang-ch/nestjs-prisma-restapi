import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { pick } from 'lodash';
import { randomUUID } from 'node:crypto';
import { SerializedError, SerializedRequest, SerializedResponse } from 'pino-std-serializers';

function pinoHttpOption(level: string = 'debug', file = false) {
  const options = {
    colorize: true,
    levelFirst: true,
    // time-format
    translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o',
  };

  if (file) {
    Object.assign(options, {
      colorize: false,
      destination: './logs/combined.log',
      mkdir: true,
    });
  }

  return {
    customAttributeKeys: {
      // req: 'req',
      // res: 'res',
      // err: 'err',
      responseTime: 'taken(ms)',
    },
    serializers: {
      // 自定义请求日志
      req(_req: SerializedRequest) {
        const serialized = { method: _req.method, url: _req.url };
        const request = _req.raw as Request;
        const fields = pick(request, ['headers', 'query', 'body']);
        Object.assign(serialized, fields);
        return serialized;
      },
      res(response: SerializedResponse) {
        const { statusCode: status, ...serialized } = response;

        return Object.assign({ status }, serialized);
      },
      err(_err: SerializedError) {
        const serialized = {
          ..._err,
        };
        return serialized;
      },
    },
    level,
    transport: {
      target: 'pino-pretty',
      options,
    },
    genReqId: function (req, res) {
      const reqId = req.id ?? req.headers['x-request-id'];
      if (reqId) return reqId;
      const id = randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
    },
    customLogLevel(_: Request, res: Response) {
      if (res.statusCode <= 300) return 'info';
      return 'error';
    },
  };
}

export function getLoggerOption(_configService: ConfigService) {
  return {
    pinoHttp: pinoHttpOption('debug', false),
    exclude: [{ method: RequestMethod.ALL, path: 'health' }],
  };
}
