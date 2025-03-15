import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePollOptionDto {
  @IsUUID()
  pollId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
