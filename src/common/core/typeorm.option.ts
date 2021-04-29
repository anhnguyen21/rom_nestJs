import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { configService } from '../../config/config.service'

@Injectable()
export class TypeormOptions implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<PostgresConnectionOptions> {
    return {
      ...(await TypeormOptions.createTypeOrmOptions())
    }
  }

  static async createTypeOrmOptions(): Promise<PostgresConnectionOptions> {
    const dbConfig = await configService.getTypeOrmConfig()
    return {
      ...dbConfig
    } as PostgresConnectionOptions
  }
}
