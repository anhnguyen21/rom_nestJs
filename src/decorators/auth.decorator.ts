import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from '../guard/auth.guard'

/*
Example:
@Auth() => Required authentication
@Auth(['SystemAdmin', 'User']) => Required authentication & scope = SystemAdmin || User
*/
export function Auth(scopes?: string[]) {
  if (scopes && scopes.length > 0) {
    return applyDecorators(
      SetMetadata('scopes', scopes),
      UseGuards(JwtAuthGuard),
      ApiBearerAuth(),
      ApiUnauthorizedResponse({ description: 'Unauthorized' })
    )
  }
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  )
}
