import { Injectable } from '@nestjs/common'
import { S3Adapter } from '../../shared/aws/s3'
import { DeleteFileDto, PresignedUrlDto } from './dto'
import { getFileName } from '../../providers/stringUtils'

const s3Adapter = new S3Adapter()

@Injectable()
export class UploadService {
  async getSignedUrlS3(file: PresignedUrlDto): Promise<any> {
    try {
      const { key, type } = file
      const fileName = getFileName(key)
      const uploadUrl = await s3Adapter.getSignedUrl(fileName, type)
      return {
        uploadUrl,
        fileName,
        url: uploadUrl.split('?')[0]
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async deleteFile(body: DeleteFileDto): Promise<any> {
    const { url } = body
    try {
      await s3Adapter.deleteFile(url)
      return { message: 'OK' }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
