import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';
import { Assinatura } from 'src/interfaces/guruSubscriptions.interface';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { DataSource, Repository } from 'typeorm';

import { AssinaturaUserDto } from './dto/assinatura-user.dto';
import { CreateAssinaturasDto } from './dto/create-assinaturas.dto';
import { PopulateAssinaturasDto } from './dto/populate-assinaturas.dto';
import { UpdateAssinaturasDto } from './dto/update-assinaturas.dto';
import { Assinaturas } from './entities/assinaturas.entity';
import { AssinaturaProdutoMapper } from './mappers/assinatura-produto.mapper';
import { AssinaturaUserMapper } from './mappers/assinaturas-user.mapper';
import { AssinaturaMapper } from './mappers/assinaturas.mappers';

@Injectable()
export class AssinaturasService {
  private GURU_URL = process.env.GURU_URL;
  private GURU_API_KEY = process.env.GURU_API_KEY;
  constructor(
    @InjectRepository(Assinaturas)
    private readonly assinaturasRepository: Repository<Assinaturas>,
    private readonly assinaturaMaper: AssinaturaMapper,
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    private readonly userMapper: AssinaturaUserMapper,

    @InjectRepository(Emails)
    private readonly emailRepository: Repository<Emails>,
    @InjectRepository(Produtos)
    private readonly produtoRepository: Repository<Produtos>,
    private readonly produtoMapper: AssinaturaProdutoMapper,
    private readonly httpService: HttpService,
    private dataSource: DataSource
  ) { }

  async getAssinaturas() {
    let pages = {
      path: `${this.GURU_URL}subscriptions/`,
      current_page: 1,
      first_page_url: `${this.GURU_URL}subscriptions/?page=1`,
      next_page_url: `${this.GURU_URL}subscriptions/?page=2`,
    };

    while (pages.next_page_url) {
      const url = pages.path;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.GURU_API_KEY}`,
        'Accept': 'application/json'
      };
      const response = await lastValueFrom(this.httpService.get(url, { headers }));

      const listarAssinaturas = []
      for (const assinaturas of response.data.data) {

        const created_at = new Date(assinaturas.created_at * 1000);
        const cancelled_at = assinaturas.cancelled_at ? new Date(assinaturas.cancelled_at * 1000) : null;
        const started_at = assinaturas.started_at ? new Date(assinaturas.started_at * 1000) : null;
        const updated_at = new Date(assinaturas.updated_at * 1000);
        const usuarios = await this.usuariosRepository.find({
          where: {
            documento: assinaturas.contact.doc
          }
        })

        let usuario = usuarios[0]

        if (!usuario) {
          const response = await lastValueFrom(this.httpService.get(`${this.GURU_URL}contacts/${assinaturas.contact.id}`, { headers }))

          usuario = await this.usuariosRepository.save({
            nome: response.data.name,
            telefone: response.data.phone_full_number,
            documento: response.data.doc,
            cep: response.data.address_zip_code,
            endereco: response.data.address,
            numero: response.data.address_number,
            complemento: response.data.address_comp,
            data_criacao: new Date(response.data.created_at * 1000),
            data_modificacao: new Date(response.data.updated_at * 1000),
            transacao: [],
            assinatura: [],
            email: [{
              email: response.data.email,
              integration_id: response.data.id
            } as Emails],
            integration_id: response.data.id,
            id: 0,

          })
        }

        const assinatura: PopulateAssinaturasDto = {
          id: 0,
          status: assinaturas.last_status,
          nome: assinaturas.product.name,
          data_criacao: created_at,
          data_modificacao: updated_at,
          data_inicio: started_at,
          data_cancelamento: cancelled_at,
          data_renovacao: assinaturas.next_cycle_at,
          trial_inicio: assinaturas.trial_started_at,
          trial_fim: assinaturas.trial_finished_at,
          ciclo_quantidade: assinaturas.charged_times,
          ciclo_periodo: assinaturas.charged_every_days,
          usuario: <any>usuario.id,
          transacao: [],
          integration_id: assinaturas.id,
          data_source: DataSourceEnum.Guru,
        }

        listarAssinaturas.push(assinatura)

      }

      if (listarAssinaturas.length > 0) {
        const existingAssinaturas = await this.assinaturasRepository.find();
        const existingAssinaturasIds = existingAssinaturas.map((assinatura: any) => assinatura.id);

        const newAssinaturas = listarAssinaturas.filter((assinatura: Assinatura) => !existingAssinaturasIds.includes(assinatura.id));

        if (newAssinaturas.length > 0) {
          await this.assinaturasRepository.save(newAssinaturas);
        }

        pages.current_page++;
        pages.path = response.data.next_page_url;
        pages.next_page_url = response.data.next_page_url;
        console.log('current page :::: ', response.data.current_page);
        console.log('next page :::: ', response.data.next_page_url);
      } else {
        break;
      }
    }
    return await this.assinaturasRepository.find({
      relations: ['usuario', 'transacao']
    });
  }

  private async createUser(dto: AssinaturaUserDto): Promise<Usuarios> {
    const [found] = await this.usuariosRepository.find({
      where: [
        {
          integration_id: dto.id,
        },
        { documento: dto.documento },
      ],
      take: 1,
    });

    if (found) return found;

    const user = this.userMapper.mapTo(dto);
    return this.usuariosRepository.save(user);
  }

  async create(dto: CreateAssinaturasDto) {
    const { usuario } = dto;
    const assinatura = this.assinaturaMaper.mapTo(dto);
    assinatura.usuario = await this.createUser(usuario);

    const [found] = await this.emailRepository.find({
      where: {
        email: usuario.email,
      },
      take: 1,
    });

    if (!found)
      await this.emailRepository.save({
        email: usuario.email,
        integration_id: assinatura.usuario.integration_id,
        usuario: assinatura.usuario,
      });

    return await this.assinaturasRepository.save(assinatura)
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;
    const [asinaturas, totalItems] = await this.assinaturasRepository.findAndCount({
      take: limit,
      skip
    });

    if (asinaturas.length === 0) {
      throw new NotFoundException('asinaturas não encontrados');
    }

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;


    const result = {
      data: asinaturas,
      currentPage,
      totalItems,
      perPage: asinaturas.length,
      totalPages,
      nextPage: `/assinaturas?page=${nextPage}&limit=${limit}`,
      prevPage: `/assinaturas?page=${prevPage}&limit=${limit}`,
    };

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} assinatura`;
  }

  async update(id: number, updateAssinaturasDto: UpdateAssinaturasDto) {
    const assinatura = await this.dataSource
      .getRepository(Assinaturas)
      .createQueryBuilder('assinatura')
      .where('assinatura.id = :id', { id })
      .getOne();

    if (!assinatura) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    if (updateAssinaturasDto.status) {
      assinatura.status = updateAssinaturasDto.status;
    }

    if (updateAssinaturasDto.dataCriacao) {
      assinatura.data_criacao = new Date(updateAssinaturasDto.dataCriacao);
    }

    if (updateAssinaturasDto.dataInicio) {
      assinatura.data_inicio = new Date(updateAssinaturasDto.dataInicio);
    }

    if (updateAssinaturasDto.dataRenovacao) {
      assinatura.data_renovacao = new Date(updateAssinaturasDto.dataRenovacao);
    }

    if (updateAssinaturasDto.cicloPeriodo) {
      assinatura.ciclo_periodo = updateAssinaturasDto.cicloPeriodo;
    }

    if (updateAssinaturasDto.cicloQuantidade) {
      assinatura.ciclo_quantidade = updateAssinaturasDto.cicloQuantidade;
    }

    return await this.assinaturasRepository.save(assinatura);
  }



  remove(id: number) {
    return `This action removes a #${id} assinatura`;
  }
}
