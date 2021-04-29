import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-facebook'
import { Inject } from '@nestjs/common'
import { use } from 'passport'
import * as FacebookTokenStrategy from 'passport-facebook-token'
import { AuthService } from '../main/auth/auth.service'

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @Inject('FACEBOOK_STRATEGY_CONFIG')
    private readonly facebookStrategyConfig,
    private readonly authService: AuthService
  ) {
    super(facebookStrategyConfig)
    this.init()
  }

  init() {
    use(
      new FacebookTokenStrategy(
        this.facebookStrategyConfig,
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          const { name, emails, id } = profile
          const user = {
            facebookId: id,
            email: emails[0].value,
            fullName: `${name.givenName} ${name.familyName}`
          }
          const receivedUser = await this.authService.findOrCreateSocialUser(user)
          return done(null, receivedUser)
        }
      )
    )
  }
}
