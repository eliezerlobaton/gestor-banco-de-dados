import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Alunos } from 'src/alunos/entities/aluno.entity';
import { Matricula } from 'src/alunos/entities/matricula.entity';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';
import {
  convertTimeToMonths,
  formatDate,
  getDifferenceBetweenDatesFormatted,
  makeCammelCase,
} from 'src/common/lib/common-functions';
import { Contact } from 'src/interfaces/contacts.inteface';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { AssinaturaUsuarioDto } from './dto/assinatura-usuario.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateUsuariosDto } from './dto/create-usuarios.dto';
import { CursoUsuarioDto } from './dto/curso-usuario.dto';
import { PopulateUsuariosDto } from './dto/populate-usuarios.dto';
import { UpdateUsuariosDto } from './dto/update-usuarios.dto';
import { UserQueryParametersDto } from './dto/user-query-parameters.dto';
import { UsuarioDto } from './dto/usuario.dto';
import { Emails } from './entities/emailUsuario.entity';
import { Usuarios } from './entities/usuarios.entity';

@Injectable()
export class UsuariosService {
  private GURU_URL = process.env.GURU_URL;
  private GURU_API_KEY = process.env.GURU_API_KEY;

  constructor(
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    @InjectRepository(Emails)
    private readonly emailUsuarioRepository: Repository<Emails>,
    private readonly httpService: HttpService,
    private dataSource: DataSource,
  ) {}

  async getContacts() {
    const pages = {
      path: `${this.GURU_URL}contacts/`,
      current_page: 1,
      first_page_url: `${this.GURU_URL}contacts/?page=1`,
      next_page_url: `${this.GURU_URL}contacts/?page=2`,
    };
    while (pages.next_page_url) {
      const url = pages.path;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.GURU_API_KEY}`,
        Accept: 'application/json',
      };
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );

      const listaUsuarios = response.data.data
        .filter(
          (contact: any) =>
            contact.name &&
            contact.email &&
            contact.phone_full_number &&
            contact.doc &&
            contact.address_zip_code &&
            contact.address &&
            contact.address_number,
        )
        .map((contact: Contact) => {
          const created_at = new Date(contact.created_at * 1000);
          const updated_at = new Date(contact.updated_at * 1000);
          const usuario: PopulateUsuariosDto = {
            nome: contact.name,
            telefone: contact.phone_full_number,
            documento: contact.doc,
            cep: contact.address_zip_code,
            endereco: contact.address,
            numero: contact.address_number,
            complemento: contact.address_comp,
            data_criacao: created_at,
            transacao: [],
            assinatura: [],
            integration_id: contact.id,
            data_modificacao: updated_at,
            email: contact.email,
            comentarios: '',
            estado: contact.address_state,
            cidade: contact.address_city,
            data_source: DataSourceEnum.Guru,
          };
          return usuario;
        });

      for (const usuario of listaUsuarios) {
        const usuarios = await this.usuariosRepository.find({
          where: {
            documento: usuario.documento,
          },
        });

        const email = await this.emailUsuarioRepository.find({
          where: {
            email: usuario.email,
            integration_id: usuario.integration_id,
          },
        });
        if (!usuarios.length) {
          usuario.email = email.length
            ? email
            : [
                {
                  email: usuario.email,
                  integration_id: usuario.integration_id,
                } as Emails,
              ];
          await this.usuariosRepository.save(usuario);
        } else if (!email.length) {
          await this.emailUsuarioRepository.save({
            email: usuario.email,
            integration_id: usuario.integration_id,
            usuario: <any>usuarios[0].id,
            data_source: DataSourceEnum.Guru,
          });
        }
      }

      pages.current_page++;
      pages.path = response.data.next_page_url;
      pages.next_page_url = response.data.next_page_url;
      console.log('current page :::: ', response.data.current_page);
      console.log('next page :::: ', response.data.next_page_url);
    }
    return await this.usuariosRepository.find({
      relations: ['transacao', 'assinatura'],
    });
  }

  create(createUsuariosDto: CreateUsuariosDto) {
    return 'This action adds a new usuario';
  }

  private joinLastTransaction(
    query: SelectQueryBuilder<Usuarios>,
  ): SelectQueryBuilder<Usuarios> {
    const transactionSubQuery: SelectQueryBuilder<Transacoes> = query
      .subQuery()
      .select('id')
      .distinctOn(['transacoes.usuario_id'])
      .from(Transacoes, 'transacoes')
      .orderBy('transacoes.usuario_id', 'ASC')
      .addOrderBy('transacoes.data_criacao', 'DESC');
    query.leftJoinAndSelect(
      'usuarios.transacao',
      'transacao',
      `usuarios.id = transacao.usuario_id and transacao.id IN (${transactionSubQuery.getQuery()})`,
    );
    return query;
  }

  private joinLastSignature(
    query: SelectQueryBuilder<Usuarios>,
  ): SelectQueryBuilder<Usuarios> {
    const signatureSubQuery: SelectQueryBuilder<Assinaturas> = query
      .subQuery()
      .select('id')
      .distinctOn(['assinaturas.usuario_id'])
      .from(Assinaturas, 'assinaturas')
      .orderBy('assinaturas.usuario_id', 'ASC')
      .addOrderBy('assinaturas.data_criacao', 'DESC');
    query.leftJoinAndSelect(
      'usuarios.assinatura',
      'assinatura',
      `usuarios.id = assinatura.usuario_id and assinatura.id IN (${signatureSubQuery.getQuery()})`,
    );
    return query;
  }

  filterByCategory(
    categoryId: number,
    query: SelectQueryBuilder<Usuarios>,
  ): SelectQueryBuilder<Usuarios> {
    if (categoryId) {
      query.leftJoin('produto.categories', 'categories');
      query.andWhere('categories.id = :categoryId', { categoryId });
    }
    return query;
  }

  async findAll(queryParams: UserQueryParametersDto) {
    const {
      transacao,
      assinatura,
      produto,
      inicio,
      fim,
      pesquisa,
      nome,
      email,
      telefone,
      documento,
      category: categoryId,
    } = queryParams;

    const queryBuilder = this.dataSource
      .getRepository(Usuarios)
      .createQueryBuilder('usuarios')
      .leftJoinAndSelect('usuarios.email', 'email');

    this.joinLastSignature(queryBuilder);

    this.joinLastTransaction(queryBuilder);
    queryBuilder.leftJoinAndSelect('transacao.oferta', 'oferta');
    queryBuilder.leftJoinAndSelect('transacao.produto', 'produto');

    let queryFilter = '';
    if (transacao) {
      queryBuilder.andWhere('transacao.status = :transacao', {
        transacao,
      });
      queryFilter += `&transacao=${transacao}`;
    }

    if (assinatura) {
      queryBuilder.andWhere('assinatura.status = :assinatura', {
        assinatura,
      });
      queryFilter += `&assinatura=${assinatura}`;
    }

    if (produto) {
      queryBuilder.andWhere('produto.nome = :produto', {
        produto,
      });
      queryFilter += `&produto=${produto}`;
    }

    if (inicio && fim) {
      queryBuilder.andWhere(
        'transacao.data_criacao::date BETWEEN :inicio::date AND :fim::date',
        { inicio, fim },
      );
      queryFilter += `&inicio=${inicio}&fim=${fim}`;
    }
    if (pesquisa) {
      queryBuilder.andWhere(
        '(usuarios.nome ~* :pesquisa or usuarios.telefone ~* :pesquisa or usuarios.documento ~* :pesquisa or email.email ~* :pesquisa)',
        { pesquisa: pesquisa.replace(/\+*/g, '') },
      );
      queryFilter += `&pesquisa=${pesquisa}`;
    }

    if (nome) {
      queryBuilder.andWhere('usuarios.nome ~* :nome', { nome });
      queryFilter += `&nome=${nome}`;
    }

    if (email) {
      queryBuilder.andWhere('usuarios.email ~* :email', { email });
      queryFilter += `&email=${email}`;
    }

    if (telefone) {
      queryBuilder.andWhere('usuarios.telefone ~* :telefone', { telefone });
      queryFilter += `&telefone=${telefone}`;
    }

    if (documento) {
      queryBuilder.andWhere('usuarios.documento ~* :documento', { documento });
      queryFilter += `&documento=${documento}`;
    }

    this.filterByCategory(categoryId, queryBuilder);

    const { page = 1, limit = 20 } = queryParams;
    const skip = (page - 1) * limit;
    if (queryParams.page && queryParams.limit) {
      queryBuilder.take(limit);
      queryBuilder.skip(skip);
    }

    const [usuarios, totalItems] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;

    const result = {
      data: usuarios,
      currentPage,
      totalItems,
      perPage: usuarios.length,
      totalPages,
      nextPageUrl: nextPage
        ? `/usuarios?page=${nextPage}&limit=${limit}${queryFilter}`
        : '',
      prevPageUrl: prevPage
        ? `/usuarios?page=${prevPage}&limit=${limit}${queryFilter}`
        : '',
    };

    return result;
  }

  private async mapSignatures(
    signatures: Assinaturas[],
  ): Promise<AssinaturaUsuarioDto[]> {
    const query = this.dataSource
      .getRepository(Produtos)
      .createQueryBuilder('produto');
    query.leftJoin('produto.transacao', 'transacao');
    query.leftJoin('transacao.assinatura', 'assinatura');
    return Promise.all(
      signatures.map(async (assinatura) => {
        query.where('assinatura.id = :id', { id: assinatura.id });
        const produto = await query.getOne();
        const assDto = new AssinaturaUsuarioDto();
        assDto.produto = produto?.nome;
        assDto.tipoProduto = produto?.tipo;
        Object.keys(assinatura).forEach((key) => {
          assDto[makeCammelCase(key)] = assinatura[key];
        });
        assDto.tempoAcesso = getDifferenceBetweenDatesFormatted(
          assinatura.data_inicio || assinatura.data_criacao,
          assinatura.data_cancelamento || new Date(),
        );
        assDto.teste =
          assinatura.teste || assinatura.teste_inicio || assinatura.teste_fim
            ? true
            : false;
        assDto.dataRenovacao = formatDate(assinatura.data_renovacao, 'pt-BR');
        assDto.dataCancelamento = assinatura.data_cancelamento
          ? formatDate(assinatura.data_cancelamento, 'pt-BR')
          : null;
        return assDto;
      }),
    );
  }

  private mapCourses(courses: Matricula[]): CursoUsuarioDto[] {
    return courses.map((course) => {
      const dto = new CursoUsuarioDto();
      dto.nome = course.cursoMentoria.nome;
      dto.categoria = course.cursoMentoria.categoria;
      dto.dataExpiracao = course.data_expiracao
        ? formatDate(course.data_expiracao, 'pt-BR')
        : null;
      dto.status =
        new Date().getTime() >=
        (course.data_expiracao
          ? course.data_expiracao.getTime()
          : new Date().getTime() + 10)
          ? 'Expirada'
          : 'Ativa';
      dto.tempoAcesso = getDifferenceBetweenDatesFormatted(
        course.turma.data_criacao,
        new Date().getTime() >=
          (course.data_expiracao
            ? course.data_expiracao.getTime()
            : new Date().getTime() + 10)
          ? course.data_expiracao
          : new Date(),
      );
      return dto;
    });
  }

  private hasInstallmentsFinished(transaction: Transacoes): Transacoes {
    const monthsToAdd = transaction.parcelas;
    transaction.finishedInstallments = false;
    transaction.installmentNumber = '-';
    if (monthsToAdd && !transaction.data_cancelamento) {
      let confirmationDate;
      if (typeof transaction.data_confirmacao === 'string') {
        const dateString = (<string>(<unknown>transaction.data_confirmacao))
          .split('/')
          .reverse()
          .join('-');
        confirmationDate = new Date(dateString);
      } else
        confirmationDate =
          transaction.data_confirmacao || transaction.data_criacao;

      const actualDate = new Date();
      const finishingMonth = new Date(confirmationDate.getTime());
      finishingMonth.setMonth(confirmationDate.getMonth() + monthsToAdd);
      transaction.finishedInstallments =
        actualDate >= finishingMonth ? true : false;
      const total = convertTimeToMonths(
        Math.abs(finishingMonth.getTime() - actualDate.getTime()),
      );
      transaction.installmentNumber =
        actualDate <= finishingMonth
          ? `${monthsToAdd - total}/${monthsToAdd}`
          : `${monthsToAdd}/${monthsToAdd}`;
    }
    return transaction;
  }

  async findOne(id: number): Promise<UsuarioDto> {
    const usuario = await this.dataSource
      .getRepository(Usuarios)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.email', 'email')
      .leftJoinAndSelect('usuario.assinatura', 'assinatura')
      .leftJoinAndSelect('usuario.transacao', 'transacao')
      .leftJoinAndSelect('transacao.produto', 'produto')
      .leftJoinAndSelect('transacao.oferta', 'oferta')
      .leftJoinAndMapOne(
        'usuario.aluno',
        Alunos,
        'aluno',
        'aluno.email = email.email',
      )
      .leftJoinAndSelect('aluno.matricula', 'matricula')
      .leftJoinAndSelect('matricula.turma', 'turma')
      .leftJoinAndSelect('matricula.cursoMentoria', 'cursoMentoria')
      .where('usuario.id = :id', { id })
      .getOne();

    if (!usuario) {
      throw new NotFoundException('usuario não encontrado');
    } else {
      const dto = new UsuarioDto();
      Object.keys(usuario).forEach((key) => {
        dto[makeCammelCase(key)] = usuario[key];
        return dto;
      });
      dto.produtos = {
        assinaturas: [],
        cursos: [],
      };

      dto.transacoes = usuario.transacao.map((transacao) => {
        transacao.data_confirmacao = transacao.data_confirmacao
          ? <Date>(<unknown>formatDate(transacao.data_confirmacao, 'pt-BR'))
          : null;
        transacao.data_cancelamento = transacao.data_cancelamento
          ? <Date>(<unknown>formatDate(transacao.data_cancelamento, 'pt-BR'))
          : null;
        return this.hasInstallmentsFinished(transacao);
      });
      dto.produtos.assinaturas = await this.mapSignatures(usuario.assinatura);
      dto.produtos.cursos = this.mapCourses(usuario.aluno?.matricula || []);
      return dto;
    }
  }

  async update(
    id: number,
    updateUsuariosDto: UpdateUsuariosDto,
  ): Promise<Usuarios> {
    const usuario = await this.dataSource
      .getRepository(Usuarios)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.email', 'email')
      .leftJoinAndSelect('usuario.assinatura', 'assinatura')
      .leftJoinAndSelect('usuario.transacao', 'transacao')
      .leftJoinAndSelect('transacao.oferta', 'oferta')
      .where('usuario.id = :id', { id })
      .getOne();

    if (!usuario) {
      throw new NotFoundException('usuario não encontrado');
    }

    usuario.comentarios = updateUsuariosDto.comentarios;
    console.log(this.usuariosRepository.save(usuario));
    return this.usuariosRepository.save(usuario);
  }

  async createComment(id: number, createCommentDto: CreateCommentDto) {
    const usuario = await this.dataSource
      .getRepository(Usuarios)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.email', 'email')
      .leftJoinAndSelect('usuario.assinatura', 'assinatura')
      .leftJoinAndSelect('usuario.transacao', 'transacao')
      .leftJoinAndSelect('transacao.oferta', 'oferta')
      .where('usuario.id = :id', { id })
      .getOne();

    if (!usuario) {
      throw new NotFoundException('usuario não encontrado');
    }
    usuario.comentarios = createCommentDto.comentarios;
    return await this.usuariosRepository.save(usuario);
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
