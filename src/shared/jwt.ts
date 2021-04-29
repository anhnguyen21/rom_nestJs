import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { config } from '../config'
import { AppUser } from '../entities/User'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secretKey
    })
  }
  async validate(payload: any): Promise<any> {
    const { id } = payload
    const user = await AppUser.createQueryBuilder()
      .innerJoin('AppUser.roles', 'role')
      .where('AppUser.id = :id', { id })
      .andWhere('role.name IN (:...roles)', { roles: payload.scope.split(',') })
      .select(['AppUser', 'role.name as scope'])
      .getRawOne()
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
