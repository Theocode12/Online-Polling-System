import { VoteEvent } from "./vote.event";

export class VoteDeletedEvent extends VoteEvent {
    constructor(public pollId: string, public pollOptionId: string) {
        super()
    }
}