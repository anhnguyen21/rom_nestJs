import { ApiProperty } from '@nestjs/swagger'
import { AppRole } from '../../../entities/Role'
import { PaginationResponse } from '../../../common/base/interface'

export class FindOneRoleResponse extends AppRole {}

export class FindManyRoleResponse extends PaginationResponse {
  @ApiProperty({ type: [FindOneRoleResponse] })
  items: FindOneRoleResponse[]
}
