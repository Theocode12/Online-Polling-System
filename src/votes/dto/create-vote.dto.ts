import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateVoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  description: string;

  @IsUUID()
  pollOptionId: string;
}
