import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Personnel } from './Personnel'
import { ApiProperty } from '@nestjs/swagger'

@Entity('hotel_role')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column()
  @ApiProperty()
  name: string

  @Column()
  @ApiProperty()
  description: string

  @Column()
  @ApiProperty()
  globalRole: boolean

  @Column()
  @ApiProperty()
  projectRole: boolean

  @ManyToMany((_type) => Personnel, { nullable: true })
  @JoinTable({
    name: 'personnel',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: {
      name: 'privilege_id'
    }
  })
  @ApiProperty({ type: [Personnel] })
  personnels: Personnel[]
}
