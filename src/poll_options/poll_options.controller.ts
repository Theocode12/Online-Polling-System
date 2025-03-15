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
} from '@nestjs/common';
import { PollOptionsService } from './poll_options.service';
import { CreatePollOptionDto } from './dto/create-poll_option.dto';
import { UpdatePollOptionDto } from './dto/update-poll_option.dto';
import { Public } from 'src/lib/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('poll-options')
export class PollOptionsController {
  constructor(private readonly pollOptionsService: PollOptionsService) {}

  @Post()
  create(@Body() createPollOptionDto: CreatePollOptionDto, @Request() req) {
    return this.pollOptionsService.create(createPollOptionDto, req.user);
  }

  @Public()
  @Get()
  findAll() {
    return this.pollOptionsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.pollOptionsService.findOneOrFail(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePollOptionDto: UpdatePollOptionDto,
    @Request() req,
  ) {
    return this.pollOptionsService.update(id, updatePollOptionDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    return this.pollOptionsService.remove(id, req.user);
  }
}
