import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { RoleModule } from './role/role.module'
import { PostgresTypeOrmModule } from '../common/core/typeorm.module'
import { UploadModule } from './upload/upload.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [PostgresTypeOrmModule, AuthModule, RoleModule, UploadModule, UsersModule]
})
export class AppModule {}
