import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: false, example: 'alice' })
  name: string;

  @ApiProperty({ required: true, example: 'alice@gmail.com' })
  email: string;

  @ApiProperty({ required: false, example: '2023-12-15T13:52:16.378Z' })
  createdAt?: Date;

  @ApiProperty({ required: false, example: '2023-12-15T13:52:16.378Z' })
  updatedAt?: Date;
}

export class ApiUserCreatedResponse extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false, example: 'clq6itptg0000w43jfy3ng83e' })
  id: string;
}

export class ApiUsersQueryResponse {
  @ApiProperty({ required: true, example: 10 })
  total: number;

  @ApiProperty({ required: true })
  data: ApiUserCreatedResponse;
}
