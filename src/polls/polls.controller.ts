import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Public } from 'src/lib/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  create(@Body() createPollDto: CreatePollDto, @Request() req) {
    return this.pollsService.create(createPollDto, req.user);
  }

  @Public()
  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.pollsService.findOneOrFail(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePollDto: UpdatePollDto,
    @Request() req,
  ) {
    return this.pollsService.update(id, updatePollDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.pollsService.remove(id, req.user);
  }
}
