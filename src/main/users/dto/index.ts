import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  userName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  fullName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  location: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  socialMediaLinks: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  facebookId: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  googleId: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  linkedinId: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  country: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string
}

export class DeleteUserResponse {
  @ApiProperty()
  message: string
}

export class UpdateRoleForUserDto {
  @ApiProperty()
  roleIds: number[]
}
