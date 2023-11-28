import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { AlunosService } from './alunos.service';
import { AlunoMatriculaDto } from './dto/aluno-matricula.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) { }

  @Post()
  create(@Body() dto: AlunoMatriculaDto) {
    return this.alunosService.create(dto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.alunosService.findAll(
      paginationDto
    );
  }

  @Get('find')
  async memberkitItegration() {
    return await this.alunosService.memberkitIntegration()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alunosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunosService.update(+id, updateAlunoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alunosService.remove(+id);
  }
}
