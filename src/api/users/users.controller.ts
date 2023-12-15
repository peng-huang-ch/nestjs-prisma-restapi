import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiExtension, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

import { UsersService } from '@src/services';

import { CreateUserDto, UpdateUserDto, ApiUserCreatedResponse, ApiUsersQueryResponse } from './dto';

@ApiTags('users module')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiTags('users')
  @ApiOkResponse({ status: 200, description: 'created succeed', type: ApiUserCreatedResponse })
  @ApiBadRequestResponse()
  @ApiBody({
    isArray: false,
    type: CreateUserDto,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    const where = { email };

    const used = await this.usersService.exists(where);
    if (used) throw new BadRequestException('email already used.');

    return this.usersService.create(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'ok', type: ApiUserCreatedResponse })
  @ApiForbiddenResponse()
  @ApiBody({
    isArray: true,
    type: CreateUserDto,
  })
  @ApiOperation({ summary: 'Batch create users' })
  @Post('/batch')
  async batch(@Body() createUserDto: CreateUserDto[]) {
    return this.usersService.createMany(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'pagination of users.', type: ApiUsersQueryResponse })
  @ApiOperation({ summary: 'query the users' })
  @Get()
  async getUsers() {
    const params = {
      take: 2,
      orderBy: { id: Prisma.SortOrder.desc },
    };
    return this.usersService.page(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const where = { id: id };
    return await this.usersService.findFirst({ where });
  }

  @ApiBody({
    type: UpdateUserDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = updateUserDto;
    const where = { id };
    return this.usersService.update({ where, data });
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    const where = { id };
    return this.usersService.delete(where);
  }

  @ApiBody({
    isArray: false,
    type: CreateUserDto,
  })
  @Delete()
  deleteMany() {
    const where = {};
    return this.usersService.deleteMany(where);
  }
}
