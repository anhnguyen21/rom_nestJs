import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { Inject } from '@nestjs/common'
import { use } from 'passport'
import * as GoogleTokenStrategy from 'passport-google-id-token'
import { AuthService } from '../main/auth/auth.service'

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject('GOOGLE_STRATEGY_CONFIG')
    private readonly googleStrategyConfig,
    private readonly authService: AuthService
  ) {
    super(googleStrategyConfig)
    this.init()
  }

  init() {
    use(
      new GoogleTokenStrategy(this.googleStrategyConfig, async (parseToken, googleId: string, done: any) => {
        const user = {
          googleId: parseToken.payload.sub,
          email: parseToken.payload.email,
          fullName: parseToken.payload.name
        }
        const receivedUser = await this.authService.findOrCreateSocialUser(user)
        return done(null, receivedUser)
      })
    )
  }
}
