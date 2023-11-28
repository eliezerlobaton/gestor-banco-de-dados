import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { PaginationDto } from '../common/dto/pagination.dto';
import { AssinaturasService } from './assinaturas.service';
import { CreateAssinaturasDto } from './dto/create-assinaturas.dto';
import { UpdateAssinaturasDto } from './dto/update-assinaturas.dto';

@Controller('assinaturas')
export class AssinaturasController {
  constructor(private readonly assinaturasService: AssinaturasService) { }

  @Post()
  create(@Body() dto: CreateAssinaturasDto) {
    return this.assinaturasService.create(dto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.assinaturasService.findAll(paginationDto);
  }

  @Get('find')
  async getAssinaturas() {
    return await this.assinaturasService.getAssinaturas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assinaturasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssinaturasDto: UpdateAssinaturasDto) {
    return this.assinaturasService.update(+id, updateAssinaturasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assinaturasService.remove(+id);
  }
}
