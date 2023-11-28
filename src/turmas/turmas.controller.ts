import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { TurmasService } from './turmas.service';

@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) { }

  @Post()
  create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.turmasService.create(createTurmaDto);
  }

  @Get()
  findAll() {
    return this.turmasService.findAll();
  }

  @Get('find')
  async memberkitIntegration() {
    return await this.turmasService.memberkitIntegration()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turmasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmasService.update(+id, updateTurmaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turmasService.remove(+id);
  }
}
