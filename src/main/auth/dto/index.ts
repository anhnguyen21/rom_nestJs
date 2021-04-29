import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'
import { StringResponse } from './common'

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  userName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string
}

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsNotEmpty()
  password: string
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  newPassword: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  resetPasswordToken: string
}

export class VerifyForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  resetPasswordCode: string
}

export class ForgotPasswordResponse extends StringResponse {}

export class FacebookUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  facebookId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string
}

export class SocialUserDto {
  googleId?: string

  facebookId?: string

  email: string

  fullName: string
}

export class FacebookLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  access_token: string
}

export class GoogleLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id_token: string
}
