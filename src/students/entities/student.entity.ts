import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Column()
  mobile: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ nullable: true })
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  @Column({ type: 'simple-json', nullable: true })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Index({ unique: true })
  @Column({ unique: true, nullable: true })
  username?: string;

  @Column()
  status: 'active' | 'inactive' | 'suspended' | 'graduated';

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  enrollmentDate: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  graduationDate?: Date;

  @Column({ type: 'int', default: 0 })
  enrolledCoursesCount: number;

  @Column({ type: 'int', default: 0 })
  completedCoursesCount: number;

  @Column({ type: 'simple-json', nullable: true })
  preferences?: {
    language?: string;
    timezone?: string;
    notificationsEnabled?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
  };

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  lastLoginAt?: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isMobileVerified: boolean;

  @Column({ default: true })
  isActive: boolean;
}
