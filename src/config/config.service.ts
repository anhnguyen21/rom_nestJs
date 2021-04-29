import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { getRootDirName } from '../../dirname'
import { getSecret } from '../shared/aws/getSecret'
import { localConfig } from './index'

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key]
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`)
    }

    return value
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true))
    return this
  }

  public getMode() {
    return this.getValue('NODE_ENV', true)
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false)
    return mode && mode != 'dev'
  }

  public async getTypeOrmConfig(stage?: string): Promise<TypeOrmModuleOptions> {
    // const { host, username, password, dbname: database } = await dbConfig(stage)
    return {
      type: 'postgres',
      port: Number('5432'),
      host: 'localhost',
      username: 'postgres',
      password: '123456',
      database: 'room',
      migrationsTableName: 'migration',
      logging: 'all',

      cli: {
        migrationsDir: 'src/db/migrations',
        entitiesDir: 'src/entities'
      },
      entities: [getRootDirName + '/src/entities/*{.ts,.js}'],
      subscribers: [getRootDirName + '/src/entities/*{.ts,.js}'],
      migrations: [getRootDirName + '/src/db/migrations/*{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
      ssl: this.isProduction()
    }
  }
}

export const configService = new ConfigService(process.env)

type DbConfig = {
  host: string
  username: string
  password: string
  dbname: string
}

export const dbConfig = async (stage?: string) =>
  await getSecret<DbConfig>((process.env.DB_URI as string) || `on-the-rise-db-${stage}`)

type FacebookConfig = {
  clientId: string
  clientSecret: string
}

export const facebookConfig = async () => await getSecret<FacebookConfig>(process.env.FACEBOOK_LOGIN_SECRET as string)

type LinkedInConfig = {
  consumerKey: string
  consumerSecret: string
}

export const linkedInConfig = async () => await getSecret<LinkedInConfig>(process.env.LINKED_IN_LOGIN_SECRET as string)

type GoogleConfig = {
  clientID: string
}

export const googleConfig = async () => await getSecret<GoogleConfig>(process.env.GOOGLE_LOGIN_SECRET as string)

export const getLocalConfig = async (configName: string): Promise<any> => {
  if (configName.indexOf('facebook-login') > -1) {
    return localConfig.facebook
  }
  if (configName.indexOf('google-login') > -1) {
    return localConfig.google
  }
  if (configName.indexOf('-db') > -1) {
    return localConfig.database
  }
  throw new Error(`Cannot find config ${configName}.`)
}
