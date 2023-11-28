import { Controller, Get, Query, Render } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produtos } from './produtos/entities/produtos.entity';
import { Assinaturas } from './assinaturas/entities/assinaturas.entity';
import { Transacoes } from './transacoes/entities/transacoes.entity';
import { UserQueryParametersDto } from './usuarios/dto/user-query-parameters.dto';
import { UsuariosService } from './usuarios/usuarios.service';
import { CategoryService } from './category/category.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly categoryService: CategoryService,
    @InjectRepository(Produtos)
    private readonly produtosRepository: Repository<Produtos>,
    @InjectRepository(Transacoes)
    private readonly transacoesRepository: Repository<Transacoes>,
    @InjectRepository(Assinaturas)
    private readonly assinaturasRepository: Repository<Assinaturas>,
  ) {}

  @Get()
  @Render('index')
  async root(@Query() queryParams: UserQueryParametersDto) {
    const usuarios = await this.usuariosService.findAll(queryParams);
    const { pesquisa, inicio, fim, ...options } = queryParams;
    return {
      query: {
        options: Object.values(options),
        pesquisa,
        inicio,
        fim,
      },
      usuarios: usuarios.data,
      produtos: await this.produtosRepository.find(),
      assinatura: await this.assinaturasRepository.find(),
      transacao: await this.transacoesRepository.find(),
      categories: await this.categoryService.findAll(),
    };
  }

  @Get('category')
  @Render('categorias')
  async listCategories() {
    const categories = await this.categoryService.findAll();
    return {
      categories,
      produtos: (await this.produtosRepository.find())
        .filter((item) => !item.nome.startsWith('#'))
        .sort((a, b) => a.nome.localeCompare(b.nome)),
    };
  }
}
