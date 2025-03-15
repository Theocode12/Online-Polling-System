import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PollsModule } from './polls/polls.module';
import { PollOptionsModule } from './poll_options/poll_options.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Poll } from './polls/entities/poll.entity';
import { PollOption } from './poll_options/entities/poll_option.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { VotesModule } from './votes/votes.module';
import { Vote } from './votes/entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'poll_system',
      entities: [User, Poll, PollOption, Vote],
      synchronize: true,
    }),
    UsersModule,
    PollsModule,
    PollOptionsModule,
    AuthModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    // this.testDatabaseConnection();
  }

  // async testDatabaseConnection() {
  //   try {
  //     const result = await this.dataSource.query('SELECT 1+1 AS result');
  //     console.log('✅ Database connection successful:', result);
  //   } catch (error) {
  //     console.error('❌ Database connection failed:', error);
  //   }
  // }
}
