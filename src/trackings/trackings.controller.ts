import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { TrackingsService } from './trackings.service';

@Controller('trackings')
export class TrackingsController {
  constructor(private readonly trackingsService: TrackingsService) { }

  @Post()
  create(@Body() createTrackingDto: CreateTrackingDto) {
    return this.trackingsService.create(createTrackingDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.trackingsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackingDto: UpdateTrackingDto) {
    return this.trackingsService.update(+id, updateTrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackingsService.remove(+id);
  }
}
