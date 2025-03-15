import { Poll } from 'src/polls/entities/poll.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar', { length: 100 })
  password: string;

  @OneToMany(() => Poll, (poll) => poll.user, { cascade: true })
  polls: Poll[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @Column('datetime')
  @CreateDateColumn()
  created_at: Date;

  @Column('datetime')
  @UpdateDateColumn()
  updated_at: Date;
}
