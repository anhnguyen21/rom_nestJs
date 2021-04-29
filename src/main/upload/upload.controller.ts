import { Controller, UsePipes, ValidationPipe, Post, Body, Delete } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UploadService } from './upload.service'
import { Auth } from '../../decorators/auth.decorator'
import { PresignedUrlDto, DeleteFileDto } from './dto'
import { UploadInterface } from './interface'

@Auth()
@Controller()
@ApiTags('upload')
@UsePipes(new ValidationPipe({ transform: true }))
export class UploadController {
  constructor(private readonly _model: UploadService) {}
  @Post('presignedUrlS3')
  @ApiOkResponse({
    type: UploadInterface
  })
  async getSignedUrlS3(@Body() file: PresignedUrlDto): Promise<any> {
    return this._model.getSignedUrlS3(file)
  }

  @Delete('deleteFile')
  @ApiOkResponse()
  async deleteFile(@Body() body: DeleteFileDto): Promise<any> {
    return this._model.deleteFile(body)
  }
}
