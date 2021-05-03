import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('work_level')
export class WorkLevel extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column()
  @ApiProperty()
  level: string

  @Column()
  @ApiProperty()
  description: string
}
