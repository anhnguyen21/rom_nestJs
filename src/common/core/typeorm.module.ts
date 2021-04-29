import { Module, DynamicModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeormOptions } from './typeorm.option'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormOptions
    })
  ]
})
export class PostgresTypeOrmModule {
  static forRoot(connectionName = 'default'): DynamicModule {
    return {
      module: PostgresTypeOrmModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            ...TypeormOptions.createTypeOrmOptions(),
            name: connectionName
          })
        })
      ]
    }
  }
}
