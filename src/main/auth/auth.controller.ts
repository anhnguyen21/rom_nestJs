import { VerifyForgotPasswordCodeResponse } from './interface'
import { FacebookLoginDto, GoogleLoginDto, VerifyForgotPasswordDto } from './dto'
import { Controller, Post, Body, HttpCode, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { RegisterAndLoginResponse } from './interface'
import { ForgotPasswordDto, ForgotPasswordResponse, LoginDto, RegisterDto, ResetPasswordDto } from './dto'
import { AuthService } from './auth.service'
import { StringResponse } from './dto/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
@ApiTags('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(200)
  @ApiOkResponse({
    type: RegisterAndLoginResponse,
    description: 'Register an account successful'
  })
  register(@Body() payload: RegisterDto): Promise<any> {
    return this.authService.register(payload)
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({
    type: RegisterAndLoginResponse,
    description: 'Login successful'
  })
  login(@Body() payload: LoginDto): Promise<any> {
    return this.authService.login(payload)
  }

  @Post('/forgotPassword')
  @HttpCode(200)
  @ApiOkResponse({
    type: ForgotPasswordResponse,
    description: 'Forgot your password'
  })
  forgotPassword(@Body() payload: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(payload)
  }

  @Post('/verifyForgotPasswordCode')
  @HttpCode(200)
  @ApiOkResponse({
    type: VerifyForgotPasswordCodeResponse,
    description: 'Verify reset password code'
  })
  verifyForgotPasswordCode(@Body() payload: VerifyForgotPasswordDto): Promise<any> {
    return this.authService.verifyForgotPasswordCode(payload)
  }

  @Post('/resetPassword')
  @HttpCode(200)
  @ApiOkResponse({
    type: StringResponse,
    description: 'Reset your password'
  })
  resetPassword(@Body() payload: ResetPasswordDto): Promise<any> {
    return this.authService.resetPassword(payload)
  }

  @Post('/google')
  @UseGuards(AuthGuard('google-id-token'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleLogin(@Req() req, @Body() payload: GoogleLoginDto): Promise<any> {
    return req.user
  }

  @Post('facebook')
  @UseGuards(AuthGuard('facebook-token'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async facebookLogin(@Req() req, @Body() payload: FacebookLoginDto) {
    return req.user
  }
}
