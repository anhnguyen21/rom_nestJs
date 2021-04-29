import { S3 } from 'aws-sdk'
import { HttpException } from '@nestjs/common'
import { config } from '../../config'

export class S3Adapter {
  bucket: string
  s3: S3
  constructor() {
    this.bucket = config.aws.s3BucketName
    this.s3 = new S3({
      params: { Bucket: this.bucket }
    })
  }

  async deleteFile(url: string) {
    const key = url.replace(`https://${config.aws.s3BucketName}.s3.${config.api.region}.amazonaws.com/`, '')
    return await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: key
      })
      .promise()
  }

  getSignedUrl(key: string, type: string): Promise<string> {
    const s3Params = {
      Bucket: this.bucket,
      Key: key,
      ACL: 'public-read',
      ContentType: type,
      Expires: 5 * 60 //time to expire in seconds (6 minutes)
    }
    try {
      return new Promise((resolve, reject) => {
        this.s3.getSignedUrl('putObject', s3Params, (err, url) => {
          if (err) {
            reject(err)
          } else {
            resolve(url)
          }
        })
      })
    } catch (err) {
      throw new HttpException(err, 404)
    }
  }
}
