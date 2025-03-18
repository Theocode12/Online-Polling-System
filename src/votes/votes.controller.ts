import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DuplicateVoteGuard } from './guards/duplicate-vote.guard';
import { VoteChangeGuard } from './guards/vote-change.guard';


@ApiBearerAuth()
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(DuplicateVoteGuard, VoteChangeGuard)
  @Post()
  create(@Body() createVoteDto: CreateVoteDto, @Req() req) {
    return this.votesService.create(createVoteDto, req.user);
  }

  @Get()
  findAll() {
    return this.votesService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVoteDto: UpdateVoteDto,
    @Req() req,
  ) {
    return this.votesService.update(id, updateVoteDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.votesService.remove(id, req.user);
  }
}
