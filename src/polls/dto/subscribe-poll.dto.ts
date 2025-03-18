import { IsUUID } from "class-validator";

export class SubscribePollDto {
    @IsUUID()
    pollId: string
}