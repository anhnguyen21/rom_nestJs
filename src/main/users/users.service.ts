import { UpdateRoleForUserDto } from './dto'
import { BaseService } from '../../common/base/baseService'
import { FindOneUserResponse, FindAllUserResponse } from './interface'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { AppUser } from '../../entities/User'
import { UpdateUserDto } from './dto'
import { getConnection } from 'typeorm'
import { AppRole } from '../../entities/Role'

@Injectable()
export class UsersService extends BaseService<FindAllUserResponse, FindOneUserResponse> {
  constructor() {
    super(AppUser)
  }
  async deleteUser(id: string): Promise<any> {
    const user = await AppUser.findOne({ where: { id } })
    if (!user) {
      throw new InternalServerErrorException('The user was not found.')
    } else {
      try {
        await getConnection().transaction(async (transaction) => {
          await transaction.createQueryBuilder().delete().from('app_user_role').where('user_id = :id', { id }).execute()
          await transaction.createQueryBuilder().delete().from('app_user').where('id = :id', { id }).execute()
        })
        return { message: 'Delete the user successful' }
      } catch (error) {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async updateUser(id: string, payload: UpdateUserDto): Promise<any> {
    const user = await AppUser.findOne({ where: { id } })
    if (!user) {
      throw new InternalServerErrorException('The user was not found.')
    } else {
      try {
        await getConnection()
          .createQueryBuilder()
          .update(AppUser)
          .set({ ...payload })
          .where('id = :id', { id })
          .execute()
        return await AppUser.findOne({ where: { id } })
      } catch (error) {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async updateRoleForUser(id: number, payload: UpdateRoleForUserDto) {
    const user = await AppUser.findOne({ where: { id }, relations: ['roles'] })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    user.roles = await AppRole.createQueryBuilder()
      .where('id = ANY (:roleIds)', { roleIds: payload.roleIds })
      .andWhere('AppRole.globalRole = :globalRole', { globalRole: true })
      .getMany()

    return await user.save()
  }
}
