import { ApiProperty } from '@nestjs/swagger'
import { Role } from '../../../entities/Role'
import { PaginationResponse } from '../../../common/base/interface'

export class FindOneRoleResponse extends Role {}

export class FindManyRoleResponse extends PaginationResponse {
  @ApiProperty({ type: [FindOneRoleResponse] })
  items: FindOneRoleResponse[]
}
