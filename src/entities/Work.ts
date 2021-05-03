import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { WorkLevel } from './WorkLevel'
import { ApiProperty } from '@nestjs/swagger'

@Entity('work')
export class Work extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column()
  @ApiProperty()
  name: string

  @Column()
  @ApiProperty()
  description: string

@ManyToMany((_type) => WorkLevel, { nullable: true })
  @JoinTable({
    name: 'workLevel',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: {
      name: 'privilege_id'
    }
  })
  @ApiProperty({ type: [WorkLevel] })
  workLevels: WorkLevel[]
}
