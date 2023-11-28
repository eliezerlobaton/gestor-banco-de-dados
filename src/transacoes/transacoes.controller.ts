import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { CreateTransacoesDto } from './dto/create-transacoes.dto';
import { UpdateTransacoesDto } from './dto/update-transacoes.dto';
import { TransacoesService } from './transacoes.service';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Post()
  create(@Body() createTransacoeDto: CreateTransacoesDto) {
    return this.transacoesService.create(createTransacoeDto);
  }

  @Get('find')
  integrationGuru() {
    return this.transacoesService.integrationGuru();
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.transacoesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transacoesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransacoeDto: UpdateTransacoesDto,
  ) {
    return this.transacoesService.update(+id, updateTransacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transacoesService.remove(+id);
  }
}
