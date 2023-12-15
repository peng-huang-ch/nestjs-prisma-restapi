import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@src/prisma';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async users(params: { skip?: number; take?: number; cursor?: Prisma.UserWhereUniqueInput; where?: Prisma.UserWhereInput; orderBy?: Prisma.UserOrderByWithRelationInput }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async page(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput; // where
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const [data, total] = await Promise.all([
      this.prisma.user.findMany(params), // count
      this.prisma.user.count({ where: params.where }),
    ]);
    return { total, data };
  }
}
