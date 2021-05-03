import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common'
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyForgotPasswordDto,
  SocialUserDto
} from './dto'
import { AppUser } from '../../entities/User'
import { PasswordUtil } from '../../shared/password'
import { JwtService } from '@nestjs/jwt'
import * as _ from 'lodash'
import { nanoid } from 'nanoid'
import { ROLE_NAME } from '../../common/constant'
import { Role } from '../../entities/Role'
import { getManager } from 'typeorm'
import { dateUtils } from '../../providers/datetimeUtils'
import { sendEmailResetPassword } from '../../emailService'

const userPickFields = ['id', 'email', 'userName', 'fullName', 'avatar', 'isEnabled', 'roles']

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(payload: RegisterDto): Promise<any> {
    payload.email = payload.email.toLowerCase()
    const { email, password } = payload
    delete payload.password
    const passwordHash = PasswordUtil.generateHash(password)

    const user = await AppUser.findOne({ where: { email } })
    if (user) {
      throw new NotFoundException('The email is existing.')
    }

    //default to create user with role user
    const userRole = await Role.findOne({ where: { name: ROLE_NAME.NormalUser } })
    if (!userRole) {
      throw new InternalServerErrorException('The user role was not found.')
    }
    return await getManager().transaction(async (transaction) => {
      const insertedUser = AppUser.create({ ...payload, password: passwordHash, roles: [userRole] })

      await transaction
        .getRepository(AppUser)
        .save(insertedUser)
        .catch((err) => {
          if (err.message.indexOf('uq_app_user_user_name') > -1) {
            throw new InternalServerErrorException(`User name ${payload.userName} is already existed.`)
          }
          if (err.message.indexOf('uq_app_user_email') > -1) {
            throw new InternalServerErrorException(`Email ${payload.email} is already existed.`)
          }
          throw new InternalServerErrorException(`Error when creating new user: ${err}`)
        })

      const jwtData = {
        ..._.pick(insertedUser, userPickFields),
        scope: insertedUser.roles.map((s) => s.name)?.join(',')
      }
      const { accessToken, refreshToken } = this.createTokenAndRefreshToken(jwtData)

      return {
        user: jwtData,
        accessToken,
        refreshToken
      }
    })
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<any> {
    const user = await AppUser.createQueryBuilder()
      .innerJoinAndSelect('AppUser.roles', 'role')
      .where('AppUser.email = :email', { email: payload.email.toLowerCase() })
      .getOne()

    if (user) {
      user.resetPasswordToken = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString()
      await AppUser.save(user)
      await sendEmailResetPassword(user.email, user.resetPasswordToken)
    } else {
      throw new NotFoundException('User not found')
    }
    return { message: 'Your reset password request has been confirmed' }
  }

  async verifyForgotPasswordCode(payload: VerifyForgotPasswordDto): Promise<{ resetPasswordToken: string }> {
    const { email, resetPasswordCode } = payload
    const user = await AppUser.findOne({ where: { email, resetPasswordCode } })
    if (!user) {
      throw new BadRequestException('Wrong reset password code')
    }

    user.resetPasswordTokenExpired = dateUtils.nextOneDay
    user.resetPasswordToken = nanoid(128)
    await AppUser.save(user)

    return { resetPasswordToken: user.resetPasswordToken }
  }

  async resetPassword(payload: ResetPasswordDto): Promise<any> {
    const { resetPasswordToken, newPassword } = payload
    const user = await AppUser.createQueryBuilder()
      .where('AppUser.resetPasswordToken = :resetPasswordToken', {
        resetPasswordToken: resetPasswordToken
      })
      .andWhere('AppUser.resetPasswordTokenExpired >= :resetPasswordTokenExpired', {
        resetPasswordTokenExpired: dateUtils.nowDay.toISOString()
      })
      .getOne()

    if (!user) {
      throw new UnauthorizedException('The token incorrect or expired')
    }

    user.password = PasswordUtil.generateHash(newPassword)
    user.resetPasswordToken = null
    user.resetPasswordTokenExpired = null

    await AppUser.save(user)
    return { message: 'Your password has been reset' }
  }

  async login(payload: LoginDto): Promise<any> {
    payload.email = payload.email.toLowerCase()
    const { email, password } = payload
    const user = await AppUser.createQueryBuilder()
      .innerJoinAndSelect('AppUser.roles', 'role')
      .where('AppUser.email = :email', { email })
      .orWhere('AppUser.userName = :username', { username: email })
      .addSelect('AppUser.password')
      .getOne()
    if (!user) {
      throw new NotFoundException('The email or password incorrect')
    }
    const isPasswordCorrect = PasswordUtil.validateHash(password, user.password)
    if (!isPasswordCorrect) {
      throw new NotFoundException('The email or password incorrect')
    }
    const jwtData = {
      ..._.pick(user, userPickFields),
      scope: user.roles.map((s) => s.name)?.join(',')
    }
    const { accessToken, refreshToken } = this.createTokenAndRefreshToken(jwtData)
    return {
      user: jwtData,
      accessToken,
      refreshToken
    }
  }

  createTokenAndRefreshToken(payload: any) {
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = nanoid(128)
    return {
      accessToken,
      refreshToken
    }
  }

  async findOrCreateSocialUser(socialUser: SocialUserDto) {
    const { email } = socialUser
    let user = await AppUser.findOne({ where: { email }, relations: ['roles'] })

    if (!user) {
      const randomPassword = nanoid(10)
      const passwordHash = PasswordUtil.generateHash(randomPassword)

      const userRole = await Role.findOne({ where: { name: ROLE_NAME.NormalUser } })
      if (!userRole) {
        throw new InternalServerErrorException('The user role was not found.')
      }
      await getManager().transaction(async (transaction) => {
        user = AppUser.create({ ...socialUser, password: passwordHash, roles: [userRole], userName: email })
        await transaction
          .getRepository(AppUser)
          .save(user)
          .catch((err) => {
            throw new InternalServerErrorException(`Create user failed due to ${err}`)
          })
      })
    } else {
      if (user.googleId) {
        user.googleId = socialUser.googleId
      }
      if (user.facebookId) {
        user.facebookId = socialUser.facebookId
      }
      await user.save()
    }

    const jwtData = {
      ..._.pick(user, userPickFields),
      scope: user.roles.map((s) => s.name)?.join(',')
    }
    const { accessToken, refreshToken } = this.createTokenAndRefreshToken(jwtData)

    return {
      user: jwtData,
      accessToken,
      refreshToken
    }
  }
}
