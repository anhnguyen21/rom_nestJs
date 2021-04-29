import * as AWS from 'aws-sdk'
import { config } from '../../config'
import { getLocalConfig } from '../../config/config.service'
const region = config.api.region
const client = new AWS.SecretsManager({ region })

export const getSecret = async <T>(secretName: string): Promise<T> =>
  new Promise((resolve) => {
    try {
      client.getSecretValue({ SecretId: secretName }, function (err, data) {
        if (err) {
          console.error(`Unable to fetch config ${secretName}: ${err}. Try to load local config...`)
          resolve(getLocalConfig(secretName))
        } else {
          let decodedBinarySecret: T
          if (data.SecretString != null) {
            decodedBinarySecret = JSON.parse(data.SecretString)
          } else {
            const buff = new Buffer(data.SecretBinary as string, 'base64')
            decodedBinarySecret = (buff.toString('ascii') as unknown) as T
          }
          resolve(decodedBinarySecret)
        }
      })
    } catch (err) {
      console.error(`Unable to fetch config ${secretName}: ${err}. Try to load local config...`)
      resolve(getLocalConfig(secretName))
    }
  })
