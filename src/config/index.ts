export const config = {
  env: process.env.NODE_ENV,
  api: {
    region: process.env.REGION,
    clientWebsite: process.env.CLIENT_WEBSITE
  },
  bcrypt: {
    salt: +process.env.BCRYPT_SALT || 10
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'secretKey',
    expiredIn: '3600s'
  },
  smtpService: {
    host: process.env.SMTP_HOST || 'mail.enouvodev.com',
    port: +process.env.SMTP_PORT || 465,
    user: process.env.SMTP_USER || 'noreply-dev@enouvodev.com',
    password: process.env.SMTP_PASS || 'C1sE(6u}2&'
  },
  sentry: {
    sentryKey: process.env.SENTRY_KEY
  },
  aws: {
    s3BucketName: process.env.S3_BUCKET
  }
}

export const localConfig = {
  database: { host: 'localhost', dbname: 'on-rise', username: 'onrise', password: 'password' },
  facebook: { clientId: '898935077613828', clientSecret: '14d9e68f701c0b09d31484ccc9691d0b' },
  google: {
    clientID: '401402112571-anrtk8ptn0skj8onbu7colvl5epskn28.apps.googleusercontent.com',
    clientSecret: 'BQPJC9eF1A3r2qoTM0VEYeJp'
  }
}
