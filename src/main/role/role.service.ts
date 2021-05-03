import { Injectable } from '@nestjs/common'
import { BaseService } from '../../common/base/baseService'
import { FindManyRoleResponse, FindOneRoleResponse } from './interface'
import { Role } from '../../entities/Role'

@Injectable()
export class RoleService extends BaseService<FindManyRoleResponse, FindOneRoleResponse> {
  constructor() {
    super(Role)
  }
}
