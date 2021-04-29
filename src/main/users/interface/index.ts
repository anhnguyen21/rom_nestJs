import { ApiProperty } from '@nestjs/swagger'
import { AppUser } from '../../../entities/User'
import { PaginationResponse } from '../../../common/base/interface'

export class FindOneUserResponse extends AppUser {}

export class FindAllUserResponse extends PaginationResponse {
  @ApiProperty({ type: [FindOneUserResponse] })
  items: FindOneUserResponse[]
}
