import { FindOneUserResponse, FindAllUserResponse } from './interface'
import { UpdateRoleForUserDto } from './dto'
import { UsersService } from './users.service'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { QueryFilterDto } from '../../common/base/dto'
import { DeleteUserResponse, UpdateUserDto } from './dto'
import { Auth } from '../../decorators/auth.decorator'
import { ROLE_NAME } from '../../common/constant'

@Controller('users')
@ApiTags('user')
@Auth([ROLE_NAME.SystemAdmin])
export class UsersController {
  constructor(private readonly _model: UsersService) {}

  @Get('/:id')
  @ApiOkResponse({
    type: FindOneUserResponse
  })
  async findOne(@Param('id') id: string): Promise<FindOneUserResponse> {
    return this._model.findOne(id)
  }

  @Get()
  @ApiOkResponse({
    type: FindAllUserResponse
  })
  async findAll(@Query() queryParams: QueryFilterDto): Promise<FindAllUserResponse> {
    return this._model.findAll(queryParams)
  }

  @Put('/:id')
  @ApiOkResponse({
    type: FindOneUserResponse
  })
  async update(@Param('id') id: string, @Body() payload: UpdateUserDto): Promise<FindOneUserResponse> {
    return this._model.updateUser(id, payload)
  }

  @Delete('/:id')
  @ApiOkResponse({
    type: DeleteUserResponse
  })
  remove(@Param('id') id: string) {
    return this._model.deleteUser(id)
  }

  @Post('/:id/roles')
  @ApiOkResponse({
    description: 'Add role for user'
  })
  addRoleForUser(@Param('id') id: number, @Body() payload: UpdateRoleForUserDto) {
    return this._model.updateRoleForUser(id, payload)
  }
}
