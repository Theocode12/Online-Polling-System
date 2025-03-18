import { PollOption } from 'src/poll_options/entities/poll_option.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('datetime')
  @CreateDateColumn()
  created_at: Date;

  @Column('datetime')
  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime')
  expires_at: Date;

  @ManyToOne(() => User, (user) => user.polls, { nullable: false })
  user: User;

  @OneToMany(() => PollOption, (option) => option.poll, { cascade: true })
  options: PollOption[];
}
