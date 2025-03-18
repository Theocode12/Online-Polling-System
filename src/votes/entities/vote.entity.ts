import { PollOption } from 'src/poll_options/entities/poll_option.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('datetime')
  @CreateDateColumn()
  created_at: Date;

  @Column('datetime')
  @UpdateDateColumn()
  updated_at: Date;

  @Column('uuid', { nullable: false })
  pollOptionId: string;

  @Column('uuid', { nullable: false })
  userId: string;

  @ManyToOne(() => PollOption, (pollOption) => pollOption.votes)
  pollOption: PollOption;

  @ManyToOne(() => User, (User) => User.votes)
  user: User;
}
