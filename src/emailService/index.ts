import { transporter } from '../shared/smtp'

export const sendEmailResetPassword = async (receiverEmail: string, resetPasswordCode: string) => {
  try {
    const mailOptions = {
      from: 'ontherisedev@enouvo.com',
      to: receiverEmail,
      subject: 'On the rise - Reset your password',
      html: `<p>Your reset password code is: <b>${resetPasswordCode}</b> </p>`
    }
    return await transporter.sendMail(mailOptions)
  } catch (err) {
    console.log(err)
    throw err
  }
}
