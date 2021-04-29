import { IsString, IsIn, IsUrl } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { contentTypes } from '../../../common/constant'

export class PresignedUrlDto {
  @IsString()
  @ApiProperty({
    description: 'This is file name'
  })
  key: string

  @IsString()
  @IsIn(contentTypes)
  @ApiProperty({
    description: 'This is media type of file. E.g: images/png'
  })
  type: string
}

export class DeleteFileDto {
  @IsString()
  @IsUrl()
  @ApiProperty()
  url: string
}
