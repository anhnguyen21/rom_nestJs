import { ApiProperty } from '@nestjs/swagger'

export class UploadInterface {
  @ApiProperty()
  uploadUrl: string

  @ApiProperty()
  fileName: string

  @ApiProperty()
  url: string
}
