import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';

import { CreateUsuariosDto } from './dto/create-usuarios.dto';
import { UpdateUsuariosDto } from './dto/update-usuarios.dto';
import { UsuariosService } from './usuarios.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Repository } from 'typeorm';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { UserQueryParametersDto } from './dto/user-query-parameters.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    @InjectRepository(Produtos)
    private readonly produtosRepository: Repository<Produtos>,
    @InjectRepository(Assinaturas)
    private readonly assinaturasRepository: Repository<Assinaturas>,
    @InjectRepository(Transacoes)
    private readonly transacoesRepository: Repository<Transacoes>,
  ) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuariosDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  async findAll(@Query() queryParams: UserQueryParametersDto) {
    const usuarios = await this.usuariosService.findAll(queryParams);
    const { pesquisa, inicio, fim, ...options } = queryParams;
    return usuarios;
  }

  @Get('find')
  async getContacts() {
    return await this.usuariosService.getContacts();
  }

  @Get(':id')
  @Render('usuario')
  async findOne(@Param('id') id: number) {
    const usuario = await this.usuariosService.findOne(id);
    return { usuario };
  }

  @Post(':id')
  @Redirect('#')
  update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuariosDto) {
    console.log(updateUsuarioDto);
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usuariosService.remove(+id);
  }
}
