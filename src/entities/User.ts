import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { AppRole } from './Role'
import { ApiProperty } from '@nestjs/swagger'

@Entity('app_user')
export class AppUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column()
  @ApiProperty()
  userName: string

  @Column()
  @ApiProperty()
  email: string

  @Column({ select: false })
  @ApiProperty()
  password: string

  @Column()
  @ApiProperty()
  fullName: string

  @Column({ nullable: true })
  @ApiProperty()
  avatar: string

  @Column({ nullable: true })
  @ApiProperty()
  description: string

  @Column({ nullable: true })
  @ApiProperty()
  location: string

  @Column({ nullable: true })
  @ApiProperty()
  socialMediaLinks: string

  @Column({ nullable: true })
  @ApiProperty()
  facebookId: string

  @Column({ nullable: true })
  @ApiProperty()
  googleId: string

  @Column({ nullable: true })
  @ApiProperty()
  linkedinId: string

  @Column()
  @ApiProperty()
  isEnable: boolean

  @Column({ select: false })
  @ApiProperty()
  resetPasswordToken: string

  @Column({ select: false })
  @ApiProperty()
  resetPasswordTokenExpired: Date

  @Column({ select: false })
  @ApiProperty()
  verifiedAccountToken: string

  @Column({ select: false })
  @ApiProperty()
  verifiedAccountTokenExpired: Date

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date

  @UpdateDateColumn({ name: 'modified_at' })
  @ApiProperty()
  modifiedAt: Date

  @Column({ nullable: true })
  @ApiProperty()
  createdBy: number

  @Column({ nullable: true })
  @ApiProperty()
  modifiedBy: number

  @Column({ select: false })
  @ApiProperty()
  resetPasswordCode: string

  @Column({ nullable: true })
  @ApiProperty()
  country: string

  @Column({ nullable: true })
  @ApiProperty()
  city: string

  @ManyToMany((_type) => AppRole, { nullable: true })
  @JoinTable({
    name: 'app_user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: {
      name: 'role_id'
    }
  })
  @ApiProperty({ type: [AppRole] })
  roles: AppRole[]
}
