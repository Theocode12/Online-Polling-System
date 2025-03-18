import { Poll } from 'src/polls/entities/poll.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PollOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 500 , nullable: true})
  description: string;

  @Column('datetime')
  @CreateDateColumn()
  created_at: Date;

  @Column('datetime')
  @UpdateDateColumn()
  updated_at: Date;

  @Column('uuid', { nullable: false })
  pollId: string;

  @ManyToOne(() => Poll, (poll) => poll.options)
  poll: Poll;

  @OneToMany(() => Vote, (vote) => vote.pollOption, { cascade: true })
  votes: Vote[];
}
