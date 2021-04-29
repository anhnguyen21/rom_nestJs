import { Controller, UsePipes, ValidationPipe, Get, Query, Param } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { FindOneRoleResponse, FindManyRoleResponse } from './interface'
import { Auth } from '../../decorators/auth.decorator'
import { ROLE_NAME } from '../../common/constant'
import { QueryFilterDto } from '../../common/base/dto'
@Controller('admin/roles')
@ApiTags('admin')
@UsePipes(new ValidationPipe({ transform: true }))
@Auth([ROLE_NAME.SystemAdmin])
export class RoleController {
  constructor(private readonly _model: RoleService) {}
  @Get()
  @ApiOkResponse({
    type: FindManyRoleResponse
  })
  async findAll(@Query() queryParams: QueryFilterDto): Promise<FindManyRoleResponse> {
    return this._model.findAll(queryParams)
  }
  @Get('/:id')
  @ApiOkResponse({
    type: FindOneRoleResponse
  })
  async findOne(@Param('id') id: string): Promise<FindOneRoleResponse> {
    return this._model.findOne(id)
  }
}
