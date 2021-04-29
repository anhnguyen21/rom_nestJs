import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { config } from '../../config'
import { JwtStrategy } from '../../shared/jwt'
import { FacebookStrategy } from '../../shared/facebook.strategy'
import { facebookConfig, googleConfig } from '../../config/config.service'
import { GoogleStrategy } from '../../shared/google.strategy'

const facebookStrategyConfigFactory = {
  provide: 'FACEBOOK_STRATEGY_CONFIG',
  useFactory: async () => {
    const fbConfig = await facebookConfig()
    return {
      clientID: fbConfig.clientId,
      clientSecret: fbConfig.clientSecret
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleStrategyConfigFactory = {
  provide: 'GOOGLE_STRATEGY_CONFIG',
  useFactory: async () => {
    const ggConfig = await googleConfig()
    return {
      clientID: ggConfig.clientID,
      clientSecret: ggConfig.clientSecret
    }
  }
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.jwt.secretKey,
      signOptions: {
        expiresIn: config.jwt.expiredIn
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    facebookStrategyConfigFactory,
    FacebookStrategy,
    googleStrategyConfigFactory,
    GoogleStrategy
  ],
  exports: [AuthService, JwtStrategy]
})
export class AuthModule {}
