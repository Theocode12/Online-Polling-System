import { VoteEvent } from "./vote.event";

export class VoteCreatedEvent extends VoteEvent {
    constructor(public pollId: string, public pollOptionId: string) {
        super()
    }
}