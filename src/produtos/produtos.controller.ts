import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { ProdutosService } from './produtos.service';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  create() {
    return this.produtosService.create();
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.produtosService.findAll(paginationDto);
  }

  @Get('find')
  integrationGuru() {
    return this.produtosService.integrationGuru();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.produtosService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}
