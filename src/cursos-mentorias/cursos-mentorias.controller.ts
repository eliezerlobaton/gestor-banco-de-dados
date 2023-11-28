import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CursosMentoriasService } from './cursos-mentorias.service';
import { CreateCursosMentoriaDto } from './dto/create-cursos-mentoria.dto';
import { UpdateCursosMentoriaDto } from './dto/update-cursos-mentoria.dto';

@Controller('cursos-mentorias')
export class CursosMentoriasController {
  constructor(private readonly cursosMentoriasService: CursosMentoriasService) { }

  @Post()
  create(@Body() createCursosMentoriaDto: CreateCursosMentoriaDto) {
    return this.cursosMentoriasService.create(createCursosMentoriaDto);
  }

  @Get()
  findAll() {
    return this.cursosMentoriasService.findAll();
  }

  @Get('find')
  async memberkitIntegratio() {
    return await this.cursosMentoriasService.memberkitIntegration()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosMentoriasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursosMentoriaDto: UpdateCursosMentoriaDto) {
    return this.cursosMentoriasService.update(+id, updateCursosMentoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosMentoriasService.remove(+id);
  }
}
