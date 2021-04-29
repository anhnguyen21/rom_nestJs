import { ApiProperty } from '@nestjs/swagger'

class PaginationMetaModel {
  @ApiProperty()
  totalItems: number
  @ApiProperty()
  itemCount: number
  @ApiProperty()
  itemsPerPage: number
  @ApiProperty()
  totalPages: number
  @ApiProperty()
  currentPage: number
}

export class PaginationResponse {
  @ApiProperty()
  metaData: PaginationMetaModel

  @ApiProperty({ type: [Object] })
  items: any[]
}
