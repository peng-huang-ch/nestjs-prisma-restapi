import { Injectable } from '@nestjs/common';
import type { Prisma, User } from '@prisma/client';

import { PrismaService } from '@src/prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async createMany(inputs: Prisma.UserCreateInput[]) {
    const ops = inputs.map((input) => {
      const { email, ...item } = input;
      return this.prisma.user.upsert({
        where: { email },
        update: item,
        create: input,
      });
    });
    return await this.prisma.$transaction(ops);
  }

  async exists(where: Prisma.UserWhereInput): Promise<boolean> {
    return !!this.prisma.user.findFirst({
      where,
      select: { id: true },
    });
  }

  async findFirst(params: { skip?: number; take?: number; cursor?: Prisma.UserWhereUniqueInput; where?: Prisma.UserWhereInput; orderBy?: Prisma.UserOrderByWithRelationInput }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findFirst({ skip, take, cursor, where, orderBy });
  }

  async findMany(params: { skip?: number; take?: number; cursor?: Prisma.UserWhereUniqueInput; where?: Prisma.UserWhereInput; orderBy?: Prisma.UserOrderByWithRelationInput }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
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

  async update(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async updateMany(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<Prisma.BatchPayload> {
    const { where, data } = params;
    return this.prisma.user.updateMany({
      where,
      data,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async deleteMany(where: Prisma.UserWhereInput): Promise<Prisma.BatchPayload> {
    return this.prisma.user.deleteMany({
      where,
    });
  }
}
