import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { AppPrivilege } from './Privilege'
import { ApiProperty } from '@nestjs/swagger'

@Entity('app_role')
export class AppRole extends BaseEntity {
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

  @ManyToMany((_type) => AppPrivilege, { nullable: true })
  @JoinTable({
    name: 'app_role_privilege',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: {
      name: 'privilege_id'
    }
  })
  @ApiProperty({ type: [AppPrivilege] })
  privileges: AppPrivilege[]
}
